import Image from 'next/image';
import { FC } from 'react';

const AboutCollege: FC = () => {
  return (
    <>
      <div className="relative h-96 w-full">
        <Image
          src="https://incridemo.web.app/events/EC/SHARKTANK.jpg"
          alt="Incridea Banner"
          width={500}
          height={500}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent to-black z-10">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <h1
              data-scroll
              data-scroll-speed="2"
              className={`titleFont text-4xl p-4 text-center lg:text-7xl text-white`}
            >
              About NMAMIT
            </h1>
          </div>
        </span>
      </div>

      <div className="flex flex-col lg:flex-row-reverse justify-center items-center gap-10 lg:gap-20 lg:p-10 p-5 basis-1/2">
        <div>
          <Image
            src="/assets/png/nitte-logo.png"
            alt="Nitte Logo"
            width={300}
            height={300}
          />
          <Image
            src="/assets/png/nmamit-logo.png"
            alt="Nmamit Logo"
            width={300}
            height={300}
          />
        </div>

        <div className="text-white text-lg lg:text-xl text-justify basis-1/2 my-5 bodyFont">
          Never gonna give you up Never gonna let you down Never gonna run
          around and desert you Never gonna make you cry Never gonna say goodbye
          Never gonna tell a lie and hurt you Never gonna give you up Never
          gonna let you down Never gonna run around and desert you Never gonna
          make you cry Never gonna say goodbye Never gonna tell a lie and hurt
          you
          <div className="py-5" />
          Never gonna give you up Never gonna let you down Never gonna run
          around and desert you Never gonna make you cry Never gonna say goodbye
          Never gonna tell a lie and hurt you Never gonna give you up Never
          gonna let you down Never gonna run around and desert you Never gonna
          make you cry Never gonna say goodbye Never gonna tell a lie and hurt
          you
        </div>
      </div>
    </>
  );
};

export default AboutCollege;
