import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, Flex, FormControl, FormErrorMessage, Heading, HStack, Text, useToast, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import AppToast from "../../../../components/AppToast";
import ContentEditor from "../../../../components/ContentEditor";
import CustomCard from "../../../../components/CustomCard";
import CustomInput from "../../../../components/CustomInput";
import { CustomInputNumber } from "../../../../components/CustomNumberInput";
import CustomSelect from "../../../../components/CustomSelect";
import roadmapService from "../../../../services/roadmapService";
import { getErrorMessage } from "../../../../utils/helpers";
import { countBoldItalicTexts } from "./CountAnswers";
import ListOfChoices from "./ListOfChoices";
import SanboxOfQuestion from "./SanboxOfQuestion";

type FormType = {
  id?: number;
  title: string;
  type: string;
  idx: number;
  description: string;
  answer: any;
  answerChoices: any;
  sandbox?: any;
  hint?: string;
  guide?: string;
};

export default function RoadmapQuestion() {
  const toast = useToast();
  const { id, questionId } = useParams();
  const navigate = useNavigate();

  const defaultValues = {
    title: "",
    type: "",
    idx: 0
  };
  const { control, setValue, watch, handleSubmit: onSubmit, reset } = useForm<FormType>({ defaultValues });
  const questionType = watch("type");
  const answer = watch("answer");
  const answerChoices = watch("answerChoices");

  useEffect(() => {
    if (isEmpty(id)) return navigate(-1);
    if (questionId !== "new") {
      roadmapService.getByQuestionId(id, questionId).then((res) => {
        const { data: { data: questionData = { data: {} } } = { data: {} } } = res;
        reset(questionData);
      });
    }
  }, [id, questionId]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (dataUpdate: any) => {
      return questionId === "new"
        ? roadmapService.createQuestion(id, dataUpdate)
        : roadmapService.updateQuestion(id, questionId, dataUpdate);
    },
    onSuccess: async (res: any) => {
      const { data: { data: updatedData } = { data: {} } } = res;

      toast({
        description: "Lưu thành công!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true
      });
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
    <CustomCard flexDirection="column" w="100%" minH="83vh" px="20px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <HStack w="full" spacing={4} mb={"20px"}>
        <ArrowBackIcon onClick={() => navigate(-1)} />
        <Heading size="md">{`${questionId === "new" ? "Tạo mới" : "Cập nhật"} câu hỏi`}</Heading>
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
      </HStack>
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
                onSelected={(value) => {
                  onChange(value[0]);
                  if (["multi-choices", "single-choice", "drag-drop"].includes(value[0])) setValue("answer", []);
                }}
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
          {(questionId === "new" || (questionId != "new" && !isEmpty(watch("description")))) && (
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
          )}
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

        {questionType === "snippet" && (
          <VStack w="full" align="flex-start" spacing={2}>
            <Text fontWeight={"bold"}>{"Sandbox"}</Text>
            <SanboxOfQuestion sandbox={watch("sandbox") ?? []} onUpdateSanbox={(data) => setValue("sandbox", data)} />
            <Text fontWeight={"bold"} pt="20px">
              {"Mô tả câu trả lời"}
            </Text>
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
              <ListOfChoices
                choices={answerChoices ?? []}
                rightChoices={[]}
                disableChooseRightChoices={true}
                haveArrangement={true}
                onUpdateChoices={(choices) => setValue("answerChoices", choices)}
                onUpdateRightChoices={() => {}}
              />
            </VStack>
          </VStack>
        )}

        {questionType === "multi-choices" && (
          <VStack w="full" align="flex-start" spacing={2}>
            <Text fontWeight={"bold"}>{"Danh sách câu trả lời"}</Text>
            <ListOfChoices
              choices={answerChoices ?? []}
              rightChoices={answer ?? []}
              isMultiChoices={true}
              onUpdateChoices={(choices) => setValue("answerChoices", choices)}
              onUpdateRightChoices={(rightChoices) => setValue("answer", rightChoices)}
            />
          </VStack>
        )}

        {questionType === "single-choice" && (
          <VStack w="full" align="flex-start" spacing={2}>
            <Text fontWeight={"bold"}>
              {"Danh sách câu trả lời"}
              <Text as="span" fontSize={"sm"} fontWeight={"normal"} pl="10px">
                {"(Chỉ chọn 1 câu trả lời đúng)"}
              </Text>
            </Text>
            <ListOfChoices
              choices={answerChoices ?? []}
              rightChoices={answer ?? []}
              onUpdateChoices={(choices) => setValue("answerChoices", choices)}
              onUpdateRightChoices={(rightChoices) => setValue("answer", rightChoices)}
            />
          </VStack>
        )}

        {questionType === "drag-drop" && (
          <VStack w="full" align="flex-start" spacing={2}>
            <Text fontWeight={"bold"}>
              {"Danh sách câu trả lời"}
              <Text as="span" fontSize={"sm"} fontWeight={"normal"} pl="10px">
                {"(Kéo thả để sắp xếp thứ tự đúng)"}
              </Text>
            </Text>
            <ListOfChoices
              choices={answerChoices ?? []}
              rightChoices={answer ?? []}
              haveArrangement={true}
              isMultiChoices={true}
              onUpdateChoices={(choices) => setValue("answerChoices", choices)}
              onUpdateRightChoices={(rightChoices) => setValue("answer", rightChoices)}
            />
          </VStack>
        )}
      </VStack>
    </CustomCard>
  );
}
