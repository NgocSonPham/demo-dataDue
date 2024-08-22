import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Spinner,
  Stack,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BsPen, BsPlusCircleFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import AppToast from "../../../../components/AppToast";
import CustomCard from "../../../../components/CustomCard";
import CustomInput from "../../../../components/CustomInput";
import CustomSelect from "../../../../components/CustomSelect";
import CustomUploadButton from "../../../../components/CustomUploadButton";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectConfig } from "../../../../redux/slice";
import majorService from "../../../../services/majorService";
import { getErrorMessage } from "../../../../utils/helpers";
import UpdatePostDrawer from "./UpdatePostDrawer";
import C4UCKeditor from "./C4UCKeditor";

type FormType = {
  id?: string;
  thumbnail: string;
  name: string;
  groupMajorId: string;
  descriptions: string;
  tips: string;
  studyFieldOverview: string;
  studyProgramOverview: string;
  studyFieldRequirement: string;
  trainingOrganization: string;
  metaStudyProgram: string;
  backpackCandidate: string;
  marketIndustry: string;
  careerInstruction: string;
  community: string;
};

export default function MajorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { LIST_MAJORS } = useAppSelector(selectConfig);

  const [loading, setLoading] = React.useState(true);

  const [defaultValues, setDefaultValues] = React.useState({
    name: "",
    groupMajorId: "",
    descriptions: "",
    tips: "",
    studyFieldOverview: "",
    studyProgramOverview: "",
    studyFieldRequirement: "",
    trainingOrganization: "",
    metaStudyProgram: "",
    backpackCandidate: "",
    marketIndustry: "",
    careerInstruction: "",
    community: "",
  });

  const [editingPost, setEditingPost] = React.useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    control,
    reset,
    setValue,
    watch,
    handleSubmit: onSubmit,
  } = useForm<FormType>({ defaultValues });

  const init = async () => {
    try {
      if (id === "new") {
        navigate(-1);
        return;
      }

      const {
        data: { data: post },
      } = await majorService.getById(id);

      setDefaultValues(post);
      reset(post, { keepDefaultValues: true });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return majorService.update(id, data);
    },
    onSuccess: () => {
      toast({
        description: "Lưu thành công!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true,
      });

      reset(defaultValues, { keepDefaultValues: true });
      navigate("/admin/majors");
    },
    onError: (error) => {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => (
          <AppToast status={"error"} subtitle={message} onClose={onClose} />
        ),
      });
    },
  });

  const handleSubmit: SubmitHandler<FormType> = async (data) => {
    mutate(data);
  };

  const handleUpload = async (name: string, file: string | string[]) => {
    if (name === "thumbnail") {
      setValue(
        "thumbnail",
        typeof file === "object" ? file[0] : (file as string)
      );
      return;
    }
  };

  const handleUpdatePost = (name: string, title: string, content: string) => {
    setEditingPost({ name, title, content });
    onOpen();
  };

  const handlePostUpdate = (field: string, data: any) => {
    console.log(data);
    setValue(field as keyof FormType, data.replace(/"/g, "'"));
    setEditingPost(undefined);
  };

  if (loading) {
    init();
    return (
      <CustomCard
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Center w="full" h="560px">
          <Spinner size="xl" />
        </Center>
      </CustomCard>
    );
  }

  const editMajor = (
    title: string,
    field: any,
    createTitle = "Tạo bài viết",
    editTitle = "Chỉnh sửa bài viết"
  ) => {
    return (
      <VStack w="full" spacing={"6px"}>
        <Text
          w="full"
          align="left"
          color="secondaryGray.500"
          fontSize="14px"
          fontWeight="500"
          letterSpacing={"-0.056px"}
        >
          {title}
        </Text>
        {isEmpty(watch(field)) && (
          <Button
            w="full"
            bg="white"
            border="1px dashed"
            borderColor={"secondaryGray.600"}
            color="secondaryGray.700"
            fontSize="14px"
            fontWeight="500"
            letterSpacing="-0.2px"
            lineHeight="24px"
            px={"14px"}
            py={"6px"}
            rounded={"8px"}
            leftIcon={<Icon as={BsPlusCircleFill} w="20px" h="20px" />}
            onClick={() => handleUpdatePost(field, title, watch(field))}
          >
            {createTitle}
          </Button>
        )}
        {!isEmpty(watch(field)) && (
          <HStack
            w="full"
            spacing={"4px"}
            border="1px solid "
            borderColor={"secondaryGray.100"}
            px={"12px"}
            py={"6px"}
            rounded={"8px"}
          >
            <Button
              w="full"
              bg="white"
              border="1px dashed"
              borderColor={"secondaryGray.600"}
              color="secondaryGray.700"
              fontSize="14px"
              fontWeight="500"
              letterSpacing="-0.2px"
              lineHeight="24px"
              px={"14px"}
              py={"6px"}
              rounded={"8px"}
              leftIcon={<Icon as={BsPen} w="20px" h="20px" />}
              onClick={() => handleUpdatePost(field, title, watch(field))}
            >
              {editTitle}
            </Button>
          </HStack>
        )}
      </VStack>
    );
  };

  return (
    <CustomCard
      flexDirection="column"
      w="100%"
      px="10px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Stack
        w="full"
        direction={{ base: "column", xl: "row" }}
        spacing={0}
        align="flex-start"
      >
        <VStack
          w={{ base: " full", md: "full", lg: "60%", xl: "50%" }}
          px={3}
          spacing={"12px"}
          align="flex-start"
        >
          <CustomUploadButton
            bg={"secondaryGray.300"}
            h="100px"
            label="Add Thumbnail"
            onUploadChange={handleUpload}
            name={`thumbnail`}
            src={watch("thumbnail") ?? ""}
            thumbnail
            rounded="8px"
            w="120px"
            minW="120px"
          />
          <Controller
            name="name"
            control={control}
            render={({
              field: { onChange: _, value },
              fieldState: { error },
            }) => (
              <CustomInput
                label="Tên chuyên ngành"
                isReadOnly={true}
                value={value}
                error={error}
                onTextChange={(_value) => {}}
              />
            )}
          />
          <Controller
            control={control}
            name="groupMajorId"
            rules={{ required: "Nhóm ngành không được để trống" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl isInvalid={!!error} id="groupMajorId">
                <CustomSelect
                  w="full"
                  placeholder="Chọn nhóm ngành.."
                  allowAddNew={false}
                  name={"groupMajorId"}
                  value={[value]}
                  options={LIST_MAJORS.flatMap(
                    (major: any) => major.groupMajors
                  ).map((major: any) => ({
                    label: major.name,
                    value: major.id,
                  }))}
                  onSelected={(value) => onChange(value[0])}
                />

                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
          <Controller
            name="descriptions"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                label="Mô tả ngắn"
                isMultipleLines={true}
                value={value}
                error={error}
                onTextChange={(value) => onChange(value)}
              />
            )}
          />
          {/* <Controller
            name="tips"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                label="Có thể bạn chưa biết"
                isMultipleLines={true}
                value={value}
                error={error}
                onTextChange={(value) => onChange(value)}
              />
            )}
          /> */}

          {editMajor("Có thể bạn chưa biết", "tips")}
        </VStack>
        <VStack
          w={{ base: " full", md: "full", lg: "60%", xl: "50%" }}
          px={3}
          spacing={"12px"}
          align="flex-start"
        >
          {editMajor("Tổng quan ngành học", "studyFieldOverview")}
          {editMajor("Ngành này học gì", "studyProgramOverview")}
          {editMajor("Liệu bạn có phù hợp", "studyFieldRequirement")}
          {editMajor("Các trường đào tạo", "trainingOrganization")}
          {editMajor("Khối thi - Chỉ tiêu - Học phí", "metaStudyProgram")}
          {editMajor("Hành trang cho sĩ tử", "backpackCandidate")}
          {editMajor("Thị trường của ngành", "marketIndustry")}
          {editMajor("Định hướng nghề nghiệp", "careerInstruction")}
          {editMajor("Các cộng đồng kết nối", "community")}
        </VStack>
      </Stack>
      <HStack p={4} spacing={5}>
        <Button
          isLoading={isLoading}
          onClick={onSubmit(handleSubmit)}
          variant={"brand"}
        >
          {"Lưu chuyên ngành"}
        </Button>
      </HStack>
      {isOpen && editingPost && (
        <UpdatePostDrawer
          isOpen={isOpen}
          onClose={onClose}
          {...editingPost}
          onSave={handlePostUpdate}
        />
      )}
    </CustomCard>
  );
}
