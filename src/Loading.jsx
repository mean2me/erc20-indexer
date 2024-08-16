import {
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react';

const Loading = ({ show }) => {
  return (
    <Modal isOpen={show} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={'transparent'} sx={{}}>
        <ModalBody>
          <Center>
            <Spinner size={'lg'} />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default Loading;
