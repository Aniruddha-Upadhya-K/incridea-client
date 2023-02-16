import { isJwtExpired, getRefreshTokenExpiry } from "@/src/utils/jwt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "../../../lib/apollo";

import {
  MeDocument,
  SignInDocument,
  RefreshTokenDocument,
} from "../../../generated/generated";
import jwt from "jsonwebtoken";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
  }

  interface User {
    data: {
      email: string;
      id: string;
      isVerified: boolean;
      name: string;
      role: string;
    };

    login: {
      data: {
        accessToken: string;
        refreshToken: string;
      };
    };

    accessToken: string;
  }

  interface AdapterUser {
    data: {
      access: string;
      refresh: string;
    };
    accessToken: string;
  }

  interface JWT {
    iat: number;
    exp: number;
    accessToken: string;
  }

  interface Session {
    user: {
      data: {
        email: string;
        id: string;
        isVerified: boolean;
        name: string;
        role: string;
      };
    };
    accessToken: string;
  }
}

export const refreshToken = async function (token: string) {
  const { data } = await client.mutate({
    mutation: RefreshTokenDocument,
    variables: {
      refreshToken: token,
    },
  });
  if (data?.refreshToken.__typename === "MutationRefreshTokenSuccess") {
    return [
      data.refreshToken.data.accessToken,
      data.refreshToken.data.refreshToken,
    ];
  }
  return [null, null];
};

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {},
      async authorize(credentials: any, _req): Promise<any> {
        const { email, password } = credentials;
        const { data } = await client.mutate({
          mutation: SignInDocument,
          variables: {
            email: email as string,
            password: password as string,
          },
        });

        if (data?.login.__typename === "MutationLoginSuccess") {
          return data;
        }
        throw new Error(data?.login.message);
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user }): Promise<any> {
      if (!token && !user) {
        return null;
      }

      if (user) {
        const { accessToken, refreshToken } = user.login.data;
        token = {
          ...token,
          accessToken: accessToken,
          refreshToken: refreshToken,
          iat: Math.floor(Date.now() / 1000),
          exp: getRefreshTokenExpiry(refreshToken),
          data: await fetchUser(String(token.accessToken)),
        };
        // user Info is not returnd by the backend, so we need to fetch it
        return token;
      }

      // user was signed in previously, we want to check if the token needs refreshing
      // token has been invalidated, try refreshing it
      if (isJwtExpired(String(token.accessToken))) {
        const [newAccessToken, newRefreshToken] = await refreshToken(
          String(token.refreshToken)
        );
        console.log("newAccessToken", newAccessToken, newRefreshToken);

        if (newAccessToken && newRefreshToken) {
          token = {
            ...token,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            exp: getRefreshTokenExpiry(newRefreshToken),
            data: await fetchUser(String(token.accessToken)),
          };

          return token;
        }

        // unable to refresh tokens from backend, invalidate the token
        return null;
      }
      token.data = await fetchUser(String(token.accessToken));
      return token;
    },

    async session({ session, token, user }) {
      const userOrToken = user || token;
      session.accessToken = userOrToken.accessToken;
      session.user.data = userOrToken.data;
      return session;
    },
  },
});

const fetchUser = async (accessToken: string) => {
  const { data } = await client.query({
    query: MeDocument,
    context: {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
    fetchPolicy: "no-cache",
  });
  if (data?.me.__typename === "QueryMeSuccess") {
    return data.me.data;
  }
  throw new Error(
    data?.me.__typename === "Error" ? data.me.message : "Something went wrong"
  );
};
