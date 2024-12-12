"use client";

import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import AppToast from "../../../../components/AppToast";
import userService from "../../../../services/userService";
import { USER_ROLE } from "../../../../utils/constants";
import { getErrorMessage } from "../../../../utils/helpers";

export default function UpdateRoleModal({
  user,
  onClose,
}: {
  user: any;
  onClose: (reset: boolean) => void;
}) {
  const toast = useToast();
  const [role, setRole] = React.useState(user.roleId);

  const save = async () => {
    try {
      const { data: { data: _updated } = { data: {} } } =
        await userService.update(user.id, {
          roleId: role,
        });

      onClose(true);
    } catch (error) {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => (
          <AppToast status={"error"} subtitle={message} onClose={onClose} />
        ),
      });
    }
  };

  return (
    <Portal>
      <Modal
        isCentered={true}
        isOpen={true}
        onClose={() => onClose(false)}
        size={{ base: "sm", md: "md" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack w="full" justify={"space-between"} align={"center"}>
              <Text fontSize={"20px"} fontWeight={600}>
                {"Update User Role"}
              </Text>
              <ModalCloseButton
                rounded="full"
                border="1px"
                borderColor="gray.100"
                top="16px"
                right="24px"
              />
            </HStack>
            {/* <ModalCloseButton rounded="full" border="1px" borderColor="contentDivider" top="16px" right="24px" /> */}
          </ModalHeader>
          <ModalBody pt={0} pb="40px">
            <RadioGroup onChange={setRole} value={role}>
              <Stack direction="row">
                <Radio value={USER_ROLE.COLLABORATOR}>Collaborator</Radio>
                <Radio value={USER_ROLE.GUEST}>Guest</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              cursor={"pointer"}
              bg="brand.500"
              color="white"
              _hover={{
                bgColor: "brand.600",
                color: "white",
              }}
              onClick={save}
            >
              {"Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Portal>
  );
}
