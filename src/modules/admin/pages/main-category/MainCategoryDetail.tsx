import { Button, Center, HStack, Spinner, Stack, VStack, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import AppToast from "../../../../components/AppToast";
import CustomCard from "../../../../components/CustomCard";
import CustomInput from "../../../../components/CustomInput";
import mainCategoryService from "../../../../services/mainCategoryService";
import { getErrorMessage } from "../../../../utils/helpers";
import { CustomInputNumber } from "../../../../components/CustomNumberInput";

type FormType = {
  id?: string;
  name: string;
  idx?: number;
};

export default function MainCategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = React.useState(true);

  const [defaultValues, setDefaultValues] = React.useState({
    name: ""
  });

  const { control, reset, setValue, watch, handleSubmit: onSubmit } = useForm<FormType>({ defaultValues });

  const init = async () => {
    try {
      if (id === "new") {
        setLoading(false);
        return;
      }

      const {
        data: { data: post }
      } = await mainCategoryService.getById(id);

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
      return id === "new" ? mainCategoryService.create(data) : mainCategoryService.update(id, data);
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
      navigate("/admin/main-categories");
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
            name="name"
            control={control}
            rules={{ required: "Tên không được để trống" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                label="Tên main category"
                value={value}
                error={error}
                onTextChange={(value) => onChange(value)}
              />
            )}
          />
          <Controller
            name="idx"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInputNumber
                label="Thứ tự"
                value={value}
                onChange={(e: any) => {
                  const value = e?.target.value ?? 0;
                  onChange(value);
                }}
              />
            )}
          />
        </VStack>
      </Stack>
      <HStack p={4} spacing={5}>
        <Button isLoading={isLoading} onClick={onSubmit(handleSubmit)} variant={"brand"}>
          {"Lưu"}
        </Button>
      </HStack>
    </CustomCard>
  );
}
