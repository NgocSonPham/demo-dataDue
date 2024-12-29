import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormErrorMessage, Heading, HStack, Text, useToast, VStack } from "@chakra-ui/react";
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

type FormType = {
  id?: number;
  title: string;
  type: string;
  idx: number;
  description?: string;
};

export default function RoadmapLesson() {
  const toast = useToast();
  const { id, lessonId } = useParams();
  const navigate = useNavigate();

  const defaultValues = {
    title: "",
    type: "",
    idx: 0
  };
  const { control, setValue, watch, handleSubmit: onSubmit, reset } = useForm<FormType>({ defaultValues });

  useEffect(() => {
    if (isEmpty(id)) return navigate(-1);
    if (lessonId !== "new") {
      roadmapService.getByLessonId(id, lessonId).then((res) => {
        const { data: { data: questionData = { data: {} } } = { data: {} } } = res;
        reset(questionData);
      });
    }
  }, [id, lessonId]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (dataUpdate: any) => {
      return lessonId === "new"
        ? roadmapService.createLesson(id, dataUpdate)
        : roadmapService.updateLesson(id, lessonId, dataUpdate);
    },
    onSuccess: async (res: any) => {
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

  const save: SubmitHandler<FormType> = async (data) => {
    mutate(data);
  };

  return (
    <CustomCard flexDirection="column" w="100%" minH="83vh" px="20px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <HStack w="full" spacing={4} mb={"20px"}>
        <ArrowBackIcon onClick={() => navigate(-1)} />
        <Heading size="md">{`${lessonId === "new" ? "Tạo mới" : "Cập nhật"} bài học`}</Heading>
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
          rules={{ required: "Tên không được để trống" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomInput
              label="Tên bài học"
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
                    label: "Video",
                    value: "video"
                  },
                  {
                    label: "Exercise",
                    value: "exercise"
                  },
                  {
                    label: "Revision",
                    value: "revision"
                  }
                ]}
                onSelected={(value) => {
                  onChange(value[0]);
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
          <Text fontWeight={"bold"}>{"Mô tả"}</Text>
          {(lessonId === "new" || (lessonId != "new" && !isEmpty(watch("description")))) && (
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
      </VStack>
    </CustomCard>
  );
}
