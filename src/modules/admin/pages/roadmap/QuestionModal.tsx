"use client";

import {
  Button,
  Flex,
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
import ContentEditor from "../../../../components/ContentEditor";
import CustomInput from "../../../../components/CustomInput";
import { CustomInputNumber } from "../../../../components/CustomNumberInput";
import CustomSelect from "../../../../components/CustomSelect";
import roadmapService from "../../../../services/roadmapService";
import { getErrorMessage } from "../../../../utils/helpers";
import { countBoldItalicTexts } from "./CountAnswers";

type FormType = {
  id?: number;
  title: string;
  type: string;
  idx: number;
  description: string;
  answer: any;
  answerChoices: any;
  sanbox?: string;
  hint?: string;
  guide?: string;
};

export default function QuestionModal({
  roadmapId,
  data,
  onUpdate,
  onClose
}: {
  roadmapId: number;
  data: any;
  onUpdate: (id: number, data: any) => void;
  onClose: () => void;
}) {
  const toast = useToast();
  const defaultValues = data;

  const { control, setValue, watch, handleSubmit: onSubmit } = useForm<FormType>({ defaultValues });
  const questionType = watch("type");
  const answer = watch("answer");
  const answerChoices = watch("answerChoices");

  const { mutate, isLoading } = useMutation({
    mutationFn: (dataUpdate: any) => {
      return isEmpty(data)
        ? roadmapService.createQuestion(roadmapId, dataUpdate)
        : roadmapService.updateQuestion(roadmapId, data.id, dataUpdate);
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

  const onChangeAnswerChoices = (value: string[], index: number) => {
    setValue("answerChoices", {
      ...answerChoices,
      [index]: value
    });
  };

  const save: SubmitHandler<FormType> = async (data) => {
    mutate(data);
  };

  return (
    <Portal>
      <Modal isCentered={true} isOpen={true} onClose={onClose} size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack w="full" justify={"space-between"} align={"center"}>
              <Text fontSize={"20px"} fontWeight={600}>
                {isEmpty(data) ? "Tạo mới câu hỏi" : `Cập nhật ${data.name}`}
              </Text>
              <ModalCloseButton rounded="full" border="1px" borderColor="gray.100" top="16px" right="24px" />
            </HStack>
          </ModalHeader>
          <ModalBody pt={0} pb="40px">
            <VStack spacing={4} align="flex-start">
              <Controller
                name="title"
                control={control}
                rules={{ required: "Câu hỏi không được để trống" }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <CustomInput
                    label="Câu hỏi"
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
                      options={[
                        {
                          label: "Hot spot",
                          value: "hot-spot"
                        },
                        {
                          label: "Snippet",
                          value: "snippet"
                        },
                        {
                          label: "Multi choices",
                          value: "multi-choices"
                        },
                        {
                          label: "Single choice",
                          value: "single-choice"
                        },
                        {
                          label: "Drag & Drop",
                          value: "drag-drop"
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
              <VStack w="full" align="flex-start" spacing={1}>
                <Text fontWeight={"bold"}>{"Mô tả câu hỏi"}</Text>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl isInvalid={!!error} id="description">
                      <ContentEditor type={"html"} content={value} onChange={onChange} />

                      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
                    </FormControl>
                  )}
                />
              </VStack>

              {questionType === "hot-spot" && (
                <VStack w="full" align="flex-start" spacing={2}>
                  <Text fontWeight={"bold"}>{"Mô tả câu trả lời"}</Text>
                  <VStack w="full" align="flex-start" spacing={1}>
                    <Text>{"Đáp án"}</Text>
                    <Controller
                      control={control}
                      name="answer"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormControl isInvalid={!!error} id="answer">
                          <ContentEditor type={"json"} content={value} onChange={onChange} />

                          {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
                        </FormControl>
                      )}
                    />
                  </VStack>
                  <VStack w="full" align="flex-start" spacing={1}>
                    <Text>{"Danh sách lựa chọn"}</Text>
                    {Array.from({ length: !isEmpty(answer) ? countBoldItalicTexts(answer.content) : 0 }, (_, index) => (
                      <Flex key={index} w="full" align="center" gap="10px">
                        <CustomSelect
                          w="full"
                          placeholder={`Chọn danh sách câu trả lời cho lỗ trống ${index + 1}..`}
                          multiple
                          name={`answerChoices-${index}`}
                          value={answerChoices?.[index]}
                          options={
                            !isEmpty(answerChoices)
                              ? answerChoices?.[index]?.map((item: string) => ({
                                  label: item,
                                  value: item
                                }))
                              : []
                          }
                          onSelected={(value) => onChangeAnswerChoices(value, index)}
                        />
                      </Flex>
                    ))}
                  </VStack>
                </VStack>
              )}
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
