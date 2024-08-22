import {
  Center,
  Image,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import { isEmpty } from "lodash";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppToast from "../../components/AppToast";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectUser, setUser } from "../../redux/slice";
import userService from "../../services/userService";
import { USER_ROLE } from "../../utils/constants";
import { userFullnameOrUsername } from "../../utils/helpers";

export const Social = () => {
  const navigate = useNavigate();
  const [queries] = useSearchParams();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  React.useEffect(() => {
    if (isEmpty(user?.id?.toString())) return;
    navigate(-1);
  }, [user]);

  React.useEffect(() => {
    const accessToken = queries.get("accessToken");
    const refreshToken = queries.get("refreshToken");
    const newUser = queries.get("newUser");
    if (!isEmpty(user?.id?.toString())) return;
    
    dispatch(setUser({ accessToken, refreshToken }));

    getUserInfo(accessToken, refreshToken, newUser === "true");
  }, [queries]);

  const getUserInfo = async (
    accessToken: string,
    refreshToken: string,
    newUser: boolean
  ) => {
    const decode = jwtDecode(accessToken) as any;
    const { data: { data: userInfo } = { data: {} } } =
      await userService.getById(decode.userId);
    dispatch(setUser({ ...userInfo, accessToken, refreshToken }));

    [USER_ROLE.ADMIN, USER_ROLE.CREATOR].includes(user.roleId)
      ? navigate("/admin")
      : navigate("/");

    toast({
      position: "top-right",
      render: ({ onClose }) => (
        <AppToast
          title={"SUCCESS"}
          subtitle={`Chào mừng ${userFullnameOrUsername(user)}${
            newUser ? "" : " trở lại"
          }!`}
          onClose={onClose}
        />
      ),
    });
  };

  return (
    <Center w="100vw" h="100vh">
      <VStack spacing="20px">
        <Image src="/c4u-logo.png" rounded="10px" w="200px" h="200px" />
        <Spinner size="xl" />
        <Text>{"Đang tải, vui lòng đợi chút."}</Text>
      </VStack>
    </Center>
  );
};
