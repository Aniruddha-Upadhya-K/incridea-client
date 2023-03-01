import {
  CreateRoundDocument,
  DeleteRoundDocument,
  EventByOrganizerQuery,
} from '@/src/generated/generated';
import { Tab } from '@headlessui/react';
import { useMutation } from '@apollo/client';
import { BiLoaderAlt } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { FC, useState } from 'react';
import CreateJudgeModal from './CreateJudgeModal';
import createToast from '@/src/components/toast';

const RoundsSidebar: FC<{
  rounds: EventByOrganizerQuery['eventByOrganizer'][0]['rounds'];
  eventId: string;
}> = ({ rounds, eventId }) => {
  const [createRound, { data, loading, error }] = useMutation(
    CreateRoundDocument,
    {
      refetchQueries: ['EventByOrganizer'],
      variables: {
        eventId: eventId,
      },
      awaitRefetchQueries: true // waits for changes to be reflected, better UX(?) but slower
    }
  );

  
  const [deleteRound, { data: data2, loading: loading2, error: error2 }] =
  useMutation(DeleteRoundDocument, {
      refetchQueries: ['EventByOrganizer'],
      variables: {
        eventId: eventId,
      },
      awaitRefetchQueries: true,
    });
    
  const [selectedRound, setSelectedRound] = useState(1);

  const handleCreateRound = () => {
    let promise = createRound();
    createToast(promise, 'Adding round...');
  }

  const handleDeleteRound = () => {
    let promise = deleteRound();
    createToast(promise, 'Deleting round...');
  }
    
  return (
    <div className="flex flex-col gap-5 px-2 pb-2">
      <Tab.Group>
        <Tab.List className="flex flex-row overflow-x-auto items-center gap-2 backdrop-blur-md rounded-2xl border p-3  w-full  border-gray-600 bg-gray-900/30">
          {rounds.map((round) => (
            <Tab key={round.roundNo} className="focus:outline-none md:w-full">
              {({ selected }) => (
                <button
                  onClick={() => {
                    setSelectedRound(round.roundNo);
                  }}
                  className={` px-3 whitespace-nowrap py-2 rounded-lg  w-full ${
                    selected
                      ? 'bg-blue-900/40 text-white'
                      : 'bg-gray-600/40 text-gray-300'
                  }`}
                >
                  Round {round.roundNo}
                </button>
              )}
            </Tab>
          ))}
          <div className="flex gap-2 items-end justify-center  text-xs">
            <button
              className="bg-blue-500/50 text-white p-3 w-fit rounded-xl inline-flex gap-1 items-center"
              disabled={loading2 || loading}
              onClick={handleCreateRound}
            >
              {loading ? (
                <>
                  <BiLoaderAlt className="animate-spin text-xl" />
                  Adding...{' '}
                </>
              ) : (
                <>
                  <AiOutlinePlus className=" text-xl" /> Add
                </>
              )}
            </button>
            <button
              className="bg-red-500 text-white p-3 w-fit rounded-xl inline-flex gap-1 items-center"
              disabled={loading2 || loading}
              onClick={handleDeleteRound}
            >
              {loading2 ? (
                <>
                  <BiLoaderAlt className="animate-spin text-xl" />
                  Deleting...
                </>
              ) : (
                <>
                  <MdDelete className=" text-xl" />
                  Delete
                </>
              )}
            </button>
          </div>
        </Tab.List>

        <Tab.List className="flex flex-row">
          <div className="w-full p-3 mx-2 bg-gray-700 rounded-lg">
            <h1 className="text-xl font-bold">Judges</h1>
            {/* List of judges for this round */}
            <CreateJudgeModal eventId={eventId} roundNo={selectedRound} />
          </div>
        </Tab.List>
      </Tab.Group>
    </div>
  );
};

export default RoundsSidebar;
