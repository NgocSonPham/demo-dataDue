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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import AppToast from "../../../../components/AppToast";
import CustomInput from "../../../../components/CustomInput";
import { CustomInputNumber } from "../../../../components/CustomNumberInput";
import CustomUploadButton from "../../../../components/CustomUploadButton";
import courseService from "../../../../services/courseService";
import { getErrorMessage } from "../../../../utils/helpers";
import CustomSelect from "../../../../components/CustomSelect";
import { useEffect } from "react";

type FormType = {
  id?: number;
  name: string;
  type: string;
  specialityIds: any[];
  description?: string;
  thumbnail?: string;
};

export default function CourseModal({
  speciality,
  specialityList,
  data,
  onUpdate,
  onClose
}: {
  speciality: any;
  specialityList: any[];
  data: any;
  onUpdate: (data: any) => void;
  onClose: () => void;
}) {
  const toast = useToast();
  const defaultValues = {
    ...data,
    specialityIds: data?.specialityIds ?? (speciality ? [speciality.id] : [])
  };

  const { control, setValue, watch, handleSubmit: onSubmit, reset } = useForm<FormType>({ defaultValues });

  const init = async (id: number) => {
    const { data: { data } = { data: {} } } = await courseService.getById(id);
    reset(data);
  };
  
  useEffect(() => {
    if (isEmpty(data)) return;
    init(data.id);
  }, []);

  const { mutate, isLoading } = useMutation({
    mutationFn: (dataUpdate: any) => {
      return isEmpty(data) ? courseService.create(dataUpdate) : courseService.update(data.id, dataUpdate);
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
    if (name === "thumbnail") {
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
                    label="Tên khóa học"
                    isRequired
                    value={value}
                    error={error}
                    onTextChange={(value) => onChange(value)}
                  />
                )}
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
                      options={["Vai trò", "Luyện thi", "Tech stack"].map((item) => ({ label: item, value: item }))}
                      onSelected={(value) => onChange(value[0])}
                    />

                    {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="specialityIds"
                rules={{ required: "Ngành không được để trống" }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <FormControl isInvalid={!!error}>
                    <CustomSelect
                      w="full"
                      placeholder="Chọn ngành.."
                      allowAddNew={false}
                      multiple
                      name={"specialityIds"}
                      value={value}
                      options={specialityList.map((item) => ({ label: item.name, value: item.id }))}
                      onSelected={(value) => onChange(value)}
                    />

                    {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
                  </FormControl>
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
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <CustomInput
                    label="Mô tả khóa học"
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
