import { Button, Center, Flex, HStack, Heading, Icon, Image, Link, Stack, Text, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import AppToast from "../../components/AppToast";
import CustomInput from "../../components/CustomInput";
import { HSeparator } from "../../components/Separator";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectUser, setUser } from "../../redux/slice";
import authService from "../../services/authService";
import { USER_ROLE } from "../../utils/constants";
import { userFullnameOrUsername } from "../../utils/helpers";
import { handleEnterKeyPress } from "../../utils/keyboard";

type FormType = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export const SignUp = () => {
  const { i18n: _, t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const user = useAppSelector(selectUser);

  const [show, setShow] = React.useState(false);
  const handleShowPassword = () => setShow(!show);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const handleShowConfirmPassword = () => setShowConfirm(!showConfirm);

  React.useEffect(() => {
    if (isEmpty(user?.id?.toString())) return;
    navigate(-1);
  }, [user]);

  const defaultValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  };
  const {
    control,
    handleSubmit: onSubmit,
    watch
  } = useForm<FormType>({
    defaultValues
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: any) => {
      return authService.signUpByEmailOrUsername(data);
    },
    onSuccess: (data: any) => {
      const { data: { data: user } = { data: {} } } = data;
      dispatch(setUser(user));

      [USER_ROLE.ADMIN, USER_ROLE.COLLABORATOR].includes(user.roleId) ? navigate("/admin") : navigate("/");

      toast({
        position: "top-right",
        render: ({ onClose }) => (
          <AppToast title={"SUCCESS"} subtitle={`Chào mừng ${userFullnameOrUsername(user)}!`} onClose={onClose} />
        )
      });
    }
  });

  const handleSubmit: SubmitHandler<FormType> = (data) => {
    mutate(data);
  };

  return (
    <Center w="100vw" h="100vh" bg={"gray.50"}>
      <Stack rounded={"lg"} bg={"white"} boxShadow={"lg"} px={"40px"} py={"32px"} spacing={"20px"} maxW="500px">
        <HStack align={"center"} justify={"center"} spacing="10px">
          <Image src={"/logo.svg"} w="40px" h="40px" />
          <Text fontSize="2xl" fontWeight={600} color={"navy.700"}>
            {"Data Dude"}
          </Text>
        </HStack>
        <Flex justify={"space-between"} align={"center"}>
          <Heading fontSize={"32px"} fontWeight={600} m={0}>
            {t("auth.signUpTitle")}
          </Heading>
          <Link
            href={`/login`}
            fontSize="xs"
            px="12px"
            py="6px"
            rounded="16px"
            bg={"secondaryGray.300"}
            color={"navy.700"}
            fontWeight="500"
            _hover={{ textDecoration: "none" }}
          >
            {"Đăng nhập"}
          </Link>
        </Flex>
        <Stack spacing={"4px"}>
          <Text fontSize={"16px"}>{t("auth.email")}</Text>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email không được để trống"
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                placeholder="Nhập email của bạn"
                value={value}
                error={error}
                onTextChange={(value) => {
                  onChange(value);
                }}
                onKeyUp={handleEnterKeyPress(onSubmit(handleSubmit))}
              />
            )}
          />
        </Stack>
        <Stack spacing={"4px"}>
          <Text fontSize={"16px"}>{t("auth.userName")}</Text>
          <Controller
            name="username"
            control={control}
            rules={{
              required: "Tên người dùng không được để trống"
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                placeholder="Nhập tên người dùng"
                value={value}
                error={error}
                onTextChange={(value) => {
                  onChange(value);
                }}
                onKeyUp={handleEnterKeyPress(onSubmit(handleSubmit))}
              />
            )}
          />
        </Stack>
        <Stack spacing={"4px"}>
          <Text fontSize={"16px"}>{t("auth.password")}</Text>
          <Controller
            name="password"
            control={control}
            rules={{ required: "Mật khẩu không được để trống" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                placeholder="Nhập mật khẩu"
                type={show ? "text" : "password"}
                value={value}
                error={error}
                onTextChange={(value) => {
                  onChange(value);
                }}
                rightElement={
                  <Icon
                    color={"gray.400"}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleShowPassword}
                  />
                }
                onKeyUp={handleEnterKeyPress(onSubmit(handleSubmit))}
              />
            )}
          />
        </Stack>
        <Stack spacing={"4px"}>
          <Text fontSize={"16px"}>{t("auth.rePassowrd")}</Text>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Xác nhận mật khẩu không được để trống",
              validate: (value) => value === watch("password") || "Mật khẩu xác nhận không trùng khớp"
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                placeholder="Xác nhận lại mật khẩu"
                type={showConfirm ? "text" : "password"}
                value={value}
                error={error}
                onTextChange={(value) => {
                  onChange(value);
                }}
                rightElement={
                  <Icon
                    color={"gray.400"}
                    _hover={{ cursor: "pointer" }}
                    as={showConfirm ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleShowConfirmPassword}
                  />
                }
                onKeyUp={handleEnterKeyPress(onSubmit(handleSubmit))}
              />
            )}
          />
        </Stack>

        <Stack spacing={"10px"}>
          <Button
            variant={"brand"}
            h="50px"
            rounded="16px"
            fontSize="sm"
            fontWeight="600"
            isLoading={isLoading}
            onClick={onSubmit(handleSubmit)}
          >
            {t("auth.signUpBtn")}
          </Button>
          <Flex align="center" mb="25px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
              {"or"}
            </Text>
            <HSeparator />
          </Flex>
          <Link
            href={`https://c4uroadmap-dev-s2j4nofseq-de.a.run.app/api/v1/core/auth/google`}
            isExternal
            py="15px"
            h="50px"
            rounded="16px"
            bg={"secondaryGray.300"}
            color={"navy.700"}
            _hover={{ textDecoration: "none" }}
          >
            <Center w="full">
              <HStack align={"center"} spacing={"10px"}>
                <Icon as={FcGoogle} w="20px" h="20px" />
                <Text fontSize="sm" fontWeight="600">
                  {"Đăng ký bằng Google"}
                </Text>
              </HStack>
            </Center>
          </Link>
        </Stack>
        <Text w="full" color="gray.600" fontSize="11px" fontWeight="400" letterSpacing="-0.056px" textAlign={"center"}>
          {`Bằng việc đăng ký, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý với `}
          <Link
            href="/terms"
            color="contentPrimary"
            fontWeight="700"
            textDecoration="underline"
            _hover={{ textDecoration: "none" }}
          >
            {`Điều khoản sử dụng`}
          </Link>
          {` và `}
          <Link
            href="/privacy"
            color="contentPrimary"
            fontWeight="700"
            textDecoration="underline"
            _hover={{ textDecoration: "none" }}
          >
            {`Chính sách Bảo mật`}
          </Link>
          {` của Data Dude.`}
        </Text>
      </Stack>
    </Center>
  );
};
