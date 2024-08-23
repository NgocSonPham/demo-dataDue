import {
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
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import CustomCard from "../../../../components/CustomCard";
import CustomInput from "../../../../components/CustomInput";
import CustomSelect from "../../../../components/CustomSelect";
import provinceService from "../../../../services/provinceService";
import trainingOrganizationService from "../../../../services/trainingOrganizationService";
import { TRAINING_MODEL, TRAINING_TYPE } from "../../../../utils/constants";
import { getErrorMessage } from "../../../../utils/helpers";
import AppToast from "../../../../components/AppToast";

type FormType = {
  id?: string;
  nameVi: string;
  thumbnail: string;
  code: string;
  website: string;
  provinceId: string;
  type: string;
  model: string;
};

export default function TrainingOrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = React.useState(true);
  const [provinces, setProvinces] = React.useState<any[]>([]);

  const [defaultValues, setDefaultValues] = React.useState({
    nameVi: "",
    thumbnail: "",
    code: "",
    website: "",
    provinceId: "",
    type: "",
    model: ""
  });

  const { control, reset, setValue, watch, handleSubmit: onSubmit } = useForm<FormType>({ defaultValues });

  const init = async () => {
    try {
      const {
        data: { data: provinces }
      } = await provinceService.getAll();

      setProvinces(
        provinces.rows.map((province: any) => ({
          label: province.name,
          value: province.id
        }))
      );

      if (id === "new") {
        setLoading(false);
        return;
      }

      const {
        data: { data: post }
      } = await trainingOrganizationService.getById(id);

      setDefaultValues(post);
      reset(post, { keepDefaultValues: true });
      setLoading(false);
    } catch (error) {
      console.log("training loading error", error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => {
      return id === "new" ? trainingOrganizationService.create(data) : trainingOrganizationService.update(id, data);
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
      navigate("/admin/training-organizations");
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
          <Controller
            name="nameVi"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput label="Tên" value={value} error={error} onTextChange={(value) => onChange(value)} />
            )}
          />
          <Controller
            name="code"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput label="Mã" value={value} error={error} onTextChange={(value) => onChange(value)} />
            )}
          />
          <Controller
            name="website"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput label="Website" value={value} error={error} onTextChange={(value) => onChange(value)} />
            )}
          />
          <Controller
            control={control}
            name="provinceId"
            rules={{ required: "Tỉnh thành không được để trống" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl isInvalid={!!error}>
                <CustomSelect
                  w="full"
                  placeholder="Chọn tỉnh thành.."
                  allowAddNew={false}
                  name={"city"}
                  value={[value]}
                  options={provinces}
                  onSelected={(value) => onChange(value[0])}
                />

                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
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
                  options={TRAINING_TYPE}
                  onSelected={(value) => onChange(value[0])}
                />

                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="model"
            rules={{ required: "Mô hình không được để trống" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormControl isInvalid={!!error}>
                <CustomSelect
                  w="full"
                  placeholder="Chọn mô hình.."
                  allowAddNew={false}
                  name={"model"}
                  value={[value]}
                  options={TRAINING_MODEL}
                  onSelected={(value) => onChange(value[0])}
                />

                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
        </VStack>
      </Stack>
      <HStack p={4} spacing={5}>
        <Button isLoading={isLoading} onClick={onSubmit(handleSubmit)} variant={"brand"}>
          {"Lưu danh mục ngành"}
        </Button>
      </HStack>
    </CustomCard>
  );
}
