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
  VStack
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import AppToast from "../../../../components/AppToast";
import CustomInput from "../../../../components/CustomInput";
import { CustomInputNumber } from "../../../../components/CustomNumberInput";
import CustomUploadButton from "../../../../components/CustomUploadButton";
import courseService from "../../../../services/courseService";
import { getErrorMessage } from "../../../../utils/helpers";

type FormType = {
  id?: number;
  name: string;
  idx: number;
  thumbnail?: string;
  header?: string;
  description?: string;
};

export default function LevelModal({
  course,
  data,
  onUpdate,
  onClose
}: {
  course: any;
  data: any;
  onUpdate: (data: any) => void;
  onClose: () => void;
}) {
  const toast = useToast();
  const defaultValues = {
    ...data,
    name: data?.name ?? `Cấp độ ${(course.levels?.length ?? 0) + 1}`,
    idx: data?.idx ?? (course.levels?.length ?? 0) + 1
  };

  const { control, setValue, watch, handleSubmit: onSubmit } = useForm<FormType>({ defaultValues });

  const { mutate, isLoading } = useMutation({
    mutationFn: (dataUpdate: any) => {
      return isEmpty(data)
        ? courseService.createLevel(course.id, dataUpdate)
        : courseService.updateLevel(course.id, data.id, dataUpdate);
    },
    onSuccess: async (res: any) => {
      const { data: { data: updatedData } = { data: {} } } = res;
      onUpdate(updatedData);

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
    if (name === "thumbnail" || name === "header") {
      setValue(name, typeof file === "object" ? file[0] : (file as string));
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
                {isEmpty(data) ? "Tạo mới cấp độ" : `Cập nhật ${data.name}`}
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
                    label="Tên cấp độ"
                    isRequired
                    disabled={true}
                    value={value}
                    error={error}
                    onTextChange={(value) => onChange(value)}
                  />
                )}
              />
              <CustomUploadButton
                bg={"secondaryGray.300"}
                h="100px"
                label="Add thumbnail"
                onUploadChange={handleUpload}
                name={`thumbnail`}
                src={watch("thumbnail") ?? ""}
                thumbnail
                rounded="8px"
                w="120px"
                minW="120px"
              />
              <CustomUploadButton
                bg={"secondaryGray.300"}
                h="100px"
                label="Add header"
                onUploadChange={handleUpload}
                name={`header`}
                src={watch("header") ?? ""}
                thumbnail
                rounded="8px"
                w="120px"
                minW="120px"
              />
              <Controller
                name="idx"
                control={control}
                rules={{ required: "Thứ tự không được để trống" }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <CustomInputNumber
                    label="Thứ tự"
                    isRequired
                    disabled={true}
                    value={value}
                    error={error}
                    onChange={(value) => onChange(value)}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <CustomInput
                    label="Mô tả cấp độ"
                    isMultipleLines
                    value={value}
                    error={error}
                    onTextChange={(value) => onChange(value)}
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
