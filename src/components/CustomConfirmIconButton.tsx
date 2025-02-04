import { Icon, useDisclosure } from "@chakra-ui/react";
import CustomConfirmAlert from "./CustomConfirmAlert";

interface ButtonProps {
  title: string;
  question: string;
  icon: any;
  color: string;
  data: any;
  onConfirm: () => void;
}

export default function CustomConfirmIconButton({ title, question, icon, color, data, onConfirm }: ButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Icon as={icon} color={color} w="15px" h="15px" cursor={"pointer"} onClick={onOpen} />
      {isOpen && data && (
        <CustomConfirmAlert
          title={title}
          question={question}
          cancelText={"Cancel"}
          confirmText={"Confirm"}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
}
