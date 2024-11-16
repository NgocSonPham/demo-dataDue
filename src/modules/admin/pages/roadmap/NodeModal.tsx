"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
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
  VStack
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import AppToast from "../../../../components/AppToast";
import CustomInput from "../../../../components/CustomInput";
import { CustomInputNumber } from "../../../../components/CustomNumberInput";
import CustomSelect from "../../../../components/CustomSelect";
import CustomUploadButton from "../../../../components/CustomUploadButton";
import roadmapService from "../../../../services/roadmapService";
import { getErrorMessage } from "../../../../utils/helpers";

type FormType = {
  id?: number;
  name: string;
  specialityId: number;
  levelId: number;
  type: string;
  icon?: string;
  idx: number;
};

export default function NodeModal({
  speciality,
  levelId,
  data,
  onUpdate,
  onClose
}: {
  speciality: any;
  levelId: number;
  data: any;
  onUpdate: (id: number, data: any) => void;
  onClose: () => void;
}) {
  const toast = useToast();
  const defaultValues = data;

  const { control, setValue, watch, handleSubmit: onSubmit } = useForm<FormType>({ defaultValues });

  const { mutate, isLoading } = useMutation({
    mutationFn: (dataUpdate: any) => {
      const obj = { ...dataUpdate, specialityId: speciality.id, levelId };
      return isEmpty(data) ? roadmapService.create(obj) : roadmapService.update(data.id, obj);
    },
    onSuccess: async (res: any) => {
      const { data: { data: updatedData } = { data: {} } } = res;
      onUpdate(isEmpty(data) ? -1 : data.id, updatedData);

      toast({
        description: "Lưu thành công!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true
      });

      onClose();
    },
    onError: (error) => {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  });

  const save: SubmitHandler<FormType> = async (data) => {
    mutate(data);
  };

  const handleUpload = async (name: string, file: string | string[]) => {
    if (name === "icon") {
      setValue("icon", typeof file === "object" ? file[0] : (file as string));
      return;
    }
  };

  return (
    <Portal>
      <Modal isCentered={true} isOpen={true} onClose={onClose} size={{ base: "sm", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack w="full" justify={"space-between"} align={"center"}>
              <Text fontSize={"20px"} fontWeight={600}>
                {isEmpty(data) ? "Tạo mới node" : `Cập nhật ${data.name}`}
              </Text>
              <ModalCloseButton rounded="full" border="1px" borderColor="gray.100" top="16px" right="24px" />
            </HStack>
          </ModalHeader>
          <ModalBody pt={0} pb="40px">
            <VStack spacing={4} align="flex-start">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Tên không được để trống" }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <CustomInput
                    label="Tên node"
                    isRequired
                    value={value}
                    error={error}
                    onTextChange={(value) => onChange(value)}
                  />
                )}
              />
              <CustomUploadButton
                bg={"secondaryGray.300"}
                h="100px"
                label="Add icon"
                onUploadChange={handleUpload}
                name={`icon`}
                src={watch("icon") ?? ""}
                thumbnail
                rounded="8px"
                w="120px"
                minW="120px"
              />
              <Controller
                control={control}
                name="type"
                rules={{ required: "Loại không được để trống" }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <FormControl isInvalid={!!error}>
                    <CustomSelect
                      w="full"
                      placeholder="Chọn loại.."
                      allowAddNew={false}
                      name={"type"}
                      value={[value]}
                      options={[
                        {
                          label: "Thông thường",
                          value: "test"
                        },
                        {
                          label: "Luyện tập",
                          value: "practice"
                        },
                        {
                          label: "Final test",
                          value: "final-test"
                        }
                      ]}
                      onSelected={(value) => onChange(value[0])}
                    />

                    {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
                  </FormControl>
                )}
              />
              <Controller
                name="idx"
                control={control}
                rules={{ required: "Thứ tự không được để trống" }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <CustomInputNumber
                    label="Thứ tự"
                    isRequired
                    value={value}
                    error={error}
                    onChange={(value) => onChange(value)}
                  />
                )}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              cursor={"pointer"}
              bg="brand.500"
              color="white"
              _hover={{
                bgColor: "brand.600",
                color: "white"
              }}
              onClick={onSubmit(save)}
            >
              {"Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Portal>
  );
}
