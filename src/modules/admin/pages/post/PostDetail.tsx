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
import { isEmpty, isEqual } from "lodash";
import React, { useContext, useEffect, useMemo } from "react";
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
import { useAppDispatch } from "@/hooks/useAppDispatch";
import getPostDetail from "./services";
import { useAppSelector } from "@/hooks/useAppSelector";
import formatDateTime from "@/utils/dateTime";
import { DropdownMenuSelectAble } from "@/components/DropdownMenuSelectable";
import { resetPostDetail, setPostDetail, VERSION_OPTIONS } from "./postDetailSlice";
import { PostInterface } from "./interfaces";
import { POST_STATUS } from "./constant";
import CustomConfirmAlert from "@/components/CustomConfirmAlert";

const CONFIRM_TYPES = {
  PUBLISH: 'PUBLISH',
  DELETE: 'DELETE',
}


export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const clipboard = useClipboard({ timeout: 2000 });
  const dispatch = useAppDispatch();

  const { isExpand, setIsExpand } = useContext(BooleanContext);

  const [loading, setLoading] = React.useState(true);
  const [mainCategoryList, setMainCategoryList] = React.useState<any[]>([]);
  const [subCategoryList, setSubCategoryList] = React.useState<any[]>([]);
  const [topicList, setTopicList] = React.useState<any[]>([]);
  const [confirmType, setConfirmType] = React.useState<string | null>(null);

  const postDetail = useAppSelector((state) => state.postDetail);

  const { control, reset, setValue, watch, handleSubmit: onSubmit, formState: { isDirty, errors } } = useForm<PostInterface>({ defaultValues: postDetail });

  const isEdited = useMemo(() => {
    const compareFields = ['content', 'title', 'mainCategoryId', 'subCategoryId', 'topics', 'thumbnail', 'shortDescription'];
    return compareFields.some((field) => !isEqual(postDetail[field as keyof PostInterface], watch(field as any)));
  }, [postDetail, watch()]);

  const init = async () => {
    console.log('init');

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

      try {
        await dispatch(getPostDetail(id)).unwrap().catch((error) => {
          console.log("error>>", error);
          toast({
            title: 'Không tìm thấy bài viết',
            description: error?.message || 'Bài viết không tồn tại hoặc đã bị xóa',
            status: 'error',
            duration: 5000,
            position: 'top-right',
          });
          navigate('/admin/posts');
        })
      } catch (error) {
        console.log("error>>", error);
      }
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
    if (isExpand) {
      setIsExpand(false);
    }
    return () => {
      dispatch(resetPostDetail());
    }
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

  const handleSubmit: SubmitHandler<PostInterface> = async (data) => {
    if (id === 'new' || !postDetail.id) {
      const response: any = await postService.create(data)
      if (response.errors?.length > 0) {
        const error = response.errors[0].message || 'Có lỗi xảy ra, vui lòng thử lại!';
        toast({
          title: 'Có lỗi xảy ra',
          description: error,
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true
        })
      } else {
        dispatch(setPostDetail(response.data));
        toast({
          title: 'Tạo bài viết thành công',
          description: 'Bài viết đã được tạo thành công',
          status: 'success',
          duration: 5000,
          position: 'top-right',
        })
        navigate(`/admin/posts/${response.data.id}`);
      }
    } else {
      const updateResponse: any = await postService.update(id, data);
      if (updateResponse.errors?.length > 0) {
        const error = updateResponse.errors[0].message || 'Có lỗi xảy ra, vui lòng thử lại!';
        toast({
          title: 'Có lỗi xảy ra',
          description: error,
        })
      } else {
        dispatch(setPostDetail(updateResponse.data));
        toast({
          title: 'Cập nhật thành công',
          description: 'Bài viết đã được cập nhật thành công',
          status: 'success',
          duration: 5000,
          position: 'top-right',
        })
        console.log('updateResponse.data>>', updateResponse.data);
      }
    }
    // mutate(data);
  };

  const handleDelete = async () => {
    if (!postDetail.id) return;
    const response: any = await postService.delete(postDetail.id as any);
    if (response.errors?.length > 0) {
      const error = response.errors[0].message || 'Có lỗi xảy ra, vui lòng thử lại!';
      toast({
        title: 'Có lỗi xảy ra',
        description: error,
      })
    } else {
      toast({
        title: 'Xóa bài viết thành công',
        description: 'Bài viết đã được xóa thành công',
      })
      navigate('/admin/posts');
    }
  }

  const handleUpload = async (name: string, file: string | string[]) => {
    if (name === "thumbnail") {
      setValue("thumbnail", typeof file === "object" ? file[0] : (file as string));
      return;
    }
  };

  const handleCopyLink = () => {
    if (!postDetail.link) return;
    clipboard.copy(postDetail.link);
    toast({
      title: "Đã copy link",
      status: "success",
      position: "top-right",
      duration: 5000,
      isClosable: true
    });
  }

  const CardDetailFooter = () => <>
    <Button variant={ButtonVariants.DANGER} icon={<TrashIcon />} onClick={() => setConfirmType(CONFIRM_TYPES.DELETE)} style={{ width: '33.181px', padding: 0 }} />
    <div className={styles.actions}>
      <Button variant={ButtonVariants.SECONDARY} label="Lưu Nháp" disabled={!isEdited} onClick={onSubmit((data) => handleSubmit({ ...data, status: POST_STATUS.DRAFT }))} />
      <Button variant={ButtonVariants.PRIMARY} label="Xuất Bản" disabled={postDetail.status !== POST_STATUS.DRAFT} onClick={() => setConfirmType(CONFIRM_TYPES.PUBLISH)} />
    </div>
  </>

  useEffect(() => {
    reset({ ...postDetail }, { keepDefaultValues: true });
  }, [postDetail]);

  if (loading) {
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
                <CustomEditorWrapper type={"html"} content={value} onChange={onChange as any} saved={!isEdited} />
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
                        {postDetail.status}
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
                  <DropdownMenuSelectAble
                    options={VERSION_OPTIONS}
                    value={watch("version")}
                    onChange={(value) =>
                      setValue("version", value)
                    }
                    optionTitle="Chọn phiên bản"
                    triggerComponent={
                      <button className={styles.actionButton}>
                        Edit
                      </button>}
                  />
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
                        Link: {postDetail.link || '--'}
                      </div>
                    </div>
                  </div>
                  {
                    postDetail.link && <button className={styles.actionButton} onClick={handleCopyLink}>
                      Copy
                    </button>
                  }
                </div>
                <div className={styles.bodyItemWrapper}>
                  <div className={styles.bodyItem}>
                    <div className={styles.icon}>
                      <CalendarIcon />
                    </div>
                    <div className={styles.itemInfo}>
                      Ngày xuất bản:
                      <div className={styles.value}>
                        {postDetail.publishedAt ?
                          `${formatDateTime(postDetail.publishedAt)?.[0]} - ${formatDateTime(postDetail.publishedAt)?.[1]}`
                          : "--"}
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
                      {postDetail.updatedAt ?
                        ` ${formatDateTime(postDetail.updatedAt, true)?.[0]} - ${formatDateTime(postDetail.updatedAt, true)?.[1]}`
                        : "--"}
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
                    rules={{ required: "Tóm tắt nội dung không được để trống" }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextArea wordCount={true} limit={256} value={value} onChange={onChange} error={error} />
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
      {
        confirmType === CONFIRM_TYPES.DELETE &&
        <CustomConfirmAlert
          title="Xóa bài viết"
          question="Bạn có chắc chắn muốn xóa bài viết này không?"
          cancelText="Hủy"
          confirmText="Xóa"
          onClose={() => setConfirmType(null)}
          onConfirm={() => handleDelete()}
        />
      }
      {
        confirmType === CONFIRM_TYPES.PUBLISH &&
        <CustomConfirmAlert
          title="Xuất bản bài viết"
          question="Bạn có chắc chắn muốn xuất bản bài viết này không?"
          cancelText="Hủy"
          confirmText="Xuất bản"
          onClose={() => setConfirmType(null)}
          onConfirm={onSubmit((data) => handleSubmit({ ...data, status: POST_STATUS.PUBLISHED }))}
        />
      }

    </>
  );
}
