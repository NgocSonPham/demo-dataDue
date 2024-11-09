import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  HStack,
  Spinner,
  Stack,
  VStack,
  useToast
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import AppToast from "../../../../components/AppToast";
import CustomCard from "../../../../components/CustomCard";
import CustomInput from "../../../../components/CustomInput";
import CustomSelect from "../../../../components/CustomSelect";
import CustomUploadButton from "../../../../components/CustomUploadButton";
import mainCategoryService from "../../../../services/mainCategoryService";
import postService from "../../../../services/postService";
import subCategoryService from "../../../../services/subCategoryService";
import { getErrorMessage } from "../../../../utils/helpers";
import HtmlEditor from "../../../../components/HtmlEditor";

type FormType = {
  id?: string;
  thumbnail: string;
  title: string;
  shortDescription: string;
  mainCategoryId: number;
  subCategoryId: number;
  topics?: string[];
  content: string;
};

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = React.useState(true);
  const [mainCategoryList, setMainCategoryList] = React.useState<any[]>([]);
  const [subCategoryList, setSubCategoryList] = React.useState<any[]>([]);
  const [topicList, setTopicList] = React.useState<any[]>([]);

  const [defaultValues, setDefaultValues] = React.useState({
    thumbnail: "",
    title: "",
    shortDescription: "",
    content: ""
  });

  const { control, reset, setValue, watch, handleSubmit: onSubmit } = useForm<FormType>({ defaultValues });

  const init = async () => {
    try {
      const {
        data: { data: mainCatList }
      } = await mainCategoryService.getAll();
      setMainCategoryList(
        mainCatList.rows.map((item: any) => ({
          label: item.name,
          value: item.id
        }))
      );

      if (id === "new") {
        setLoading(false);
        return;
      }

      const {
        data: { data: post }
      } = await postService.getById(id);

      setDefaultValues(post);
      reset(post, { keepDefaultValues: true });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const initSubCategories = async (mainCategoryId: number) => {
    try {
      const {
        data: { data: list }
      } = await subCategoryService.getAll({ mainCategoryId });
      setSubCategoryList(
        list.count === 0
          ? []
          : list.rows.map((item: any) => ({
              label: item.name,
              value: item.id
            }))
      );
    } catch (error) {
      console.log("init subCat" + error);
    }
  };

  const initSubCategoryTopics = async (subCategoryId: number) => {
    try {
      const {
        data: { data: list }
      } = await subCategoryService.getAllTopics(subCategoryId);
      setTopicList(
        list.count === 0
          ? []
          : list.rows.map((item: any) => ({
              label: item.name,
              value: item.name
            }))
      );
    } catch (error) {
      console.log("init subCat" + error);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const { mainCategoryId, subCategoryId } = watch();
  React.useEffect(() => {
    if (!mainCategoryId) return;

    initSubCategories(mainCategoryId);
  }, [mainCategoryId]);

  React.useEffect(() => {
    if (!subCategoryId) return;

    initSubCategoryTopics(subCategoryId);
  }, [subCategoryId]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => {
      return id === "new" ? postService.create(data) : postService.update(id, data);
    },
    onSuccess: () => {
      toast({
        description: "Lưu thành công!",
        status: "success",
        duration: 9000,
        position: "top-right",
        isClosable: true
      });

      reset(defaultValues, { keepDefaultValues: true });
      navigate("/admin/posts");
    },
    onError: (error) => {
      const message = getErrorMessage(error);

      toast({
        position: "top-right",
        render: ({ onClose }) => <AppToast status={"error"} subtitle={message} onClose={onClose} />
      });
    }
  });

  const handleSubmit: SubmitHandler<FormType> = async (data) => {
    mutate(data);
  };

  const handleUpload = async (name: string, file: string | string[]) => {
    if (name === "thumbnail") {
      setValue("thumbnail", typeof file === "object" ? file[0] : (file as string));
      return;
    }
  };

  if (loading) {
    init();
    return (
      <CustomCard flexDirection="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Center w="full" h="560px">
          <Spinner size="xl" />
        </Center>
      </CustomCard>
    );
  }

  return (
    <CustomCard flexDirection="column" w="100%" minH="83vh" px="10px" overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Stack w="full" direction={{ base: "column", xl: "row" }} spacing={0} align="flex-start">
        <VStack w={{ base: " full", md: "full", lg: "60%", xl: "50%" }} px={3} spacing={"12px"} align="flex-start">
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
            name="title"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput label="Tên bài đăng" value={value} error={error} onTextChange={(value) => onChange(value)} />
            )}
          />
          <Controller
            name="shortDescription"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                label="Trích dẫn"
                isMultipleLines={true}
                value={value}
                error={error}
                onTextChange={(value) => onChange(value)}
              />
            )}
          />
          <Controller
            control={control}
            name="mainCategoryId"
            rules={{ required: "Main category không được để trống" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl isInvalid={!!error}>
                <CustomSelect
                  w="full"
                  placeholder="Chọn main category.."
                  allowAddNew={false}
                  name={"main-category"}
                  value={[value]}
                  options={mainCategoryList}
                  onSelected={(value) => onChange(parseInt(value[0]))}
                />

                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="subCategoryId"
            rules={{ required: "Sub category không được để trống" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl isInvalid={!!error}>
                <CustomSelect
                  w="full"
                  placeholder="Chọn sub category.."
                  allowAddNew={false}
                  name={"sub-category"}
                  value={[value]}
                  options={subCategoryList}
                  onSelected={(value) => onChange(parseInt(value[0]))}
                />

                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="topics"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl isInvalid={!!error} id="tags">
                <CustomSelect
                  w="full"
                  placeholder="Chọn hoặc thêm mới topic.."
                  multiple
                  name={"topics"}
                  value={value}
                  options={
                    isEmpty(topicList)
                      ? value?.map((item: string) => ({
                          label: item,
                          value: item
                        }))
                      : topicList
                  }
                  onSelected={onChange}
                />

                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
        </VStack>
      </Stack>
      <Box w="full" px={3} mt={5}>
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl isInvalid={!!error} id="tags">
              <HtmlEditor content={value} onChange={onChange} />

              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          )}
        />
      </Box>
      <HStack p={4} spacing={5}>
        <Button isLoading={isLoading} onClick={onSubmit(handleSubmit)} variant={"brand"}>
          {"Lưu bài đăng"}
        </Button>
      </HStack>
    </CustomCard>
  );
}
