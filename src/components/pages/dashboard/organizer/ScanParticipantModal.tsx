import Button from '@/src/components/button';
import Modal from '@/src/components/modal';
import { FC, useState } from 'react';
import { MdOutlineQrCodeScanner } from 'react-icons/md';
import { QRCodeScanner } from './QRCodeScanner';

const ScanParticipantModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        intent={'primary'}
        className=" w-full"
        outline
        size={'large'}
      >
        Scan <MdOutlineQrCodeScanner className="inline-block text-2xl" />
      </Button>
      <Modal
        title="Scan Participant"
        showModal={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <QRCodeScanner intent="addToEvent" />
      </Modal>
    </div>
  );
};

export default ScanParticipantModal;
