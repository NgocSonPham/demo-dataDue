import {
  Box,
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
import React, { useContext, useEffect } from "react";
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
import ContentEditor from "../../../../components/ContentEditor";
import styles from './styles.module.scss'
import MarkSaved from "@/assets/icons/MarkSaved";
import LanguageIcon from "@/assets/icons/Language";
import CustomEditorWrapper from "../../../../components/CustomEditorWrapper";
import DraftIcon from "@/assets/icons/DraftIcon";
import VersionIcon from "@/assets/icons/VersionIcon";
import PinIcon from "@/assets/icons/PinIcon";
import LinkIcon from "@/assets/icons/LinkIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import clsx from "clsx";
import TextArea from "@/components/TextArea";
import TrashIcon from "@/assets/icons/TrashIcon";
import Button, { ButtonVariants } from "@/components/Button";
import BooleanContext from "../../layout/context/ExpandContext";
import CardContent from "@/components/card/CardContent";
import CardTitle from "@/components/card/components/CardTitle";
import FolderIcon from "@/assets/icons/FolderIcon";
import { MultiSelect } from "@/components/ui/multi-select";
import MultipleShapes from "@/assets/icons/MultipleShapes";
import SingleSelect from "@/components/ui/select";
import { useClipboard } from "@/hooks/use-clipboard";
import StickyHeader from "./StickyHeader";


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
  const clipboard = useClipboard({ timeout: 2000 });

  const { isExpand, setIsExpand } = useContext(BooleanContext);
  console.log('isExpand>>', isExpand);

  const [loading, setLoading] = React.useState(true);
  const [mainCategoryList, setMainCategoryList] = React.useState<any[]>([]);
  const [subCategoryList, setSubCategoryList] = React.useState<any[]>([]);
  const [topicList, setTopicList] = React.useState<any[]>([]);
  console.log('mainCategoryList>>', mainCategoryList);

  const [defaultValues, setDefaultValues] = React.useState({
    thumbnail: "",
    title: "",
    shortDescription: "",
    content: ""
  });
  console.log('id>>', id);

  const { control, reset, setValue, watch, handleSubmit: onSubmit } = useForm<FormType>({ defaultValues });
  console.log('control>>', control);

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
      console.log('list>>', list);

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
    console.log('data>>', data);
    mutate(data);
  };

  const handleUpload = async (name: string, file: string | string[]) => {
    if (name === "thumbnail") {
      setValue("thumbnail", typeof file === "object" ? file[0] : (file as string));
      return;
    }
  };

  const CardDetailFooter = () => <>
    <Button variant={ButtonVariants.DANGER} icon={<TrashIcon />} style={{ width: '33.181px', padding: 0 }} />
    <div className={styles.actions}>
      <Button variant={ButtonVariants.SECONDARY} label="Lưu Nháp" onClick={onSubmit(handleSubmit)} />
      <Button variant={ButtonVariants.PRIMARY} label="Xuất Bản" />
    </div>
  </>

  useEffect(() => {
    if (isExpand) {
      setIsExpand(false);
    }
  }, [])


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
    <>
      <div className={styles.container}>
        <div className={clsx(styles.content, isExpand ? styles.expandedSidebar : styles.closedSidebar)}>
          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl isInvalid={!!error} id="tags">
                <CustomEditorWrapper type={"html"} content={value} onChange={onChange as any} />
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
          <div className={styles.detail}>
            <CardContent headerTitle="THÔNG TIN CHUNG" footer={<CardDetailFooter />}>
              <div className={styles.section}>
                <div className={styles.bodyItemWrapper}>
                  <div className={styles.bodyItem}>
                    <div className={styles.icon}>
                      <DraftIcon />
                    </div>
                    <div className={styles.itemInfo}>
                      Trạng thái:
                      <div className={styles.value}>
                        Draft
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.bodyItemWrapper}>
                  <div className={styles.bodyItem}>
                    <div className={styles.icon}>
                      <VersionIcon />
                    </div>
                    <div className={styles.itemInfo}>
                      Phiên bản:
                      <div className={styles.value}>
                        Free Plan
                      </div>
                    </div>
                  </div>
                  <button className={styles.actionButton}>
                    Edit
                  </button>
                </div>
                <div className={styles.bodyItemWrapper}>
                  <div className={styles.bodyItem}>
                    <div className={styles.icon}>
                      <PinIcon />
                    </div>
                    <div className={styles.itemInfo}>
                      Tiêu điểm:
                      <div className={styles.value}>
                        Off
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.bodyItemWrapper}>
                  <div className={styles.bodyItem}>
                    <div className={styles.icon}>
                      <LinkIcon />
                    </div>
                    <div className={styles.itemInfo}>
                      Link:
                      <div className={styles.link}>
                        Link: https://datadude.vn/--/--/ ..
                      </div>
                    </div>
                  </div>
                  <button className={styles.actionButton} onClick={() => clipboard.copy('Link: https://datadude.vn/--/--/ ..')}>
                    Copy
                  </button>
                </div>
                <div className={styles.bodyItemWrapper}>
                  <div className={styles.bodyItem}>
                    <div className={styles.icon}>
                      <CalendarIcon />
                    </div>
                    <div className={styles.itemInfo}>
                      Ngày xuất bản:
                      <div className={styles.value}>
                        --
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.bodyItemWrapper}>
                  <div className={styles.bodyItem}>
                    <div className={styles.icon}>
                      <CalendarIcon />
                    </div>
                    <div className={styles.itemInfo}>
                      Ngày cập nhật:
                      <div className={styles.value}>
                        19/07/2024 - 10:10 pm
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.section}>
                <CardTitle title="Ảnh bìa" size="small" />
                <div>
                  <CustomUploadButton
                    bg={"#fff"}
                    h="140px"
                    w="293px"
                    onUploadChange={handleUpload}
                    name={`thumbnail`}
                    src={watch("thumbnail") ?? ""}
                    thumbnail
                    rounded="0px"
                    triggerButton={{
                      component: 'Thay Đổi Ảnh Bìa',
                      className: clsx(styles.actionButton, styles.triggerButton)
                    }}
                  />
                </div>
              </div>
              <div className={styles.section}>
                <CardTitle title="Tóm tắt nội dung" size="small" />
                <div className={styles.body}>
                  <Controller
                    name="shortDescription"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextArea wordCount limit={100} value={value} onChange={onChange} error={error} />
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardContent headerTitle="PHÂN LOẠI BÀI VIẾT" titleSize="large">
              <div className={styles.section} style={{ gap: 16 }}>
                <Controller
                  control={control}
                  name="mainCategoryId"
                  rules={{ required: "Main category không được để trống" }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormControl isInvalid={!!error}>
                      <SingleSelect
                        options={mainCategoryList}
                        value={String(value || '')}
                        onChange={(value) => onChange(parseInt(value as any))}
                        placeholderIcon={<FolderIcon />}
                        label="Danh mục bài viết"
                        error={error}
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
                      <SingleSelect
                        options={subCategoryList}
                        value={String(value || '')}
                        onChange={(value) => onChange(parseInt(value as any))}
                        placeholderIcon={<MultipleShapes />}
                        label="Nhóm bài viết"
                        error={error}
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
                      <MultiSelect
                        options={topicList}
                        onValueChange={onChange}
                        defaultValue={value}
                        label='Chủ đề bài viết'
                        maxCount={3}
                        header='Chọn chủ đề'
                        optionClassName={'max-w-[250px]'}
                        error={error}
                        emptyText={!mainCategoryId ? 'Vui lòng chọn danh mục bài viết trước' : !subCategoryId ? 'Vui lòng chọn nhóm bài viết trước' : 'Không tìm thấy kết quả'}
                      />
                      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
                    </FormControl>
                  )}
                />
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </>
  );
}
