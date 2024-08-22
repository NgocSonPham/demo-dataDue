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
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import AppToast from "../../../../components/AppToast";
import CustomSelect from "../../../../components/CustomSelect";
import provinceService from "../../../../services/provinceService";
import { getErrorMessage } from "../../../../utils/helpers";

export default function UpdateTypeModal({
  data,
  onClose,
}: {
  data: any;
  onClose: (reset: boolean) => void;
}) {
  const toast = useToast();
  const [type, setType] = React.useState(data.type || []);

  const save = async () => {
    try {
      await provinceService.update(data.id, {
        type,
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
                {`Cập nhật khu vực ${data.name}`}
              </Text>
              <ModalCloseButton
                rounded="full"
                border="1px"
                borderColor="gray.100"
                top="16px"
                right="24px"
              />
            </HStack>
          </ModalHeader>
          <ModalBody pt={0} pb="40px">
            <CustomSelect
              w="full"
              placeholder="Chọn khu vực.."
              allowAddNew={false}
              multiple
              name={"type"}
              value={type}
              options={[
                {
                  label: "Khu vực 1 (KV1)",
                  value: "Khu vực 1 (KV1)",
                },
                {
                  label: "Khu vực 2 (KV2)",
                  value: "Khu vực 2 (KV2)",
                },
                {
                  label: "Khu vực 2 nông thôn (KV2-NT)",
                  value: "Khu vực 2 nông thôn (KV2-NT)",
                },
                {
                  label: "Khu vực 3 (KV3)",
                  value: "Khu vực 3 (KV3)",
                },
              ]}
              onSelected={(value) => setType(value)}
            />
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
