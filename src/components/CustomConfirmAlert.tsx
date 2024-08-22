import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React from "react";

const CustomConfirmAlert = ({
  title,
  question,
  cancelText,
  confirmText,
  onClose,
  onConfirm,
}: {
  title: string;
  question: string;
  cancelText: string;
  confirmText: string;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const cancelRef = React.useRef(null);

  return (
    <AlertDialog
      isOpen={true}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{question}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} bgColor="gray.200"
              color="black"
              _hover={{
                bgColor: "gray.300",
              }} onClick={onClose}>
              {cancelText}
            </Button>
            <Button
              bgColor="red.600"
              color="white"
              _hover={{
                bgColor: "red.700",
              }}
              onClick={() => {
                onClose();
                setTimeout(() => {
                  onConfirm();
                }, 0);
              }}
              ml={3}
            >
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CustomConfirmAlert;
