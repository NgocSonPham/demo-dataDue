import {
  Avatar,
  Box,
  Center,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { MdNotificationsNone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectUser, setUser } from "../../../../redux/slice";
import { userFullnameOrUsername } from "../../../../utils/helpers";
import routes from "../../routes";
import { SidebarResponsive } from "../sidebar";
import { ItemContent } from "./ItemContent";
import React from "react";
import { isEmpty } from "lodash";
import { collection, getCountFromServer, query, Timestamp, where } from "firebase/firestore";
import { db } from "../../../../utils/firebase";
import useNotification from "../../../../hooks/useNotification";
import AppToast from "../../../../components/AppToast";

export default function HeaderLinks() {
  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.700", "brand.400");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const toast = useToast();

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const { notification } = useNotification();

  React.useEffect(() => {
    if (!isEmpty(notification)) {
      toast({
        position: "top-right",
        render: ({ onClose }) => (
          <AppToast
            status={"info"}
            title={notification.title}
            subtitle={notification.body}
            link="/admin/notifications"
            onClose={onClose}
          />
        )
      });
    }
  }, [notification]);

  const [unreadNotifications, setUnreadNotifications] = React.useState(0);

  const getUnreadNotifications = async () => {
    if (isEmpty(user) || isEmpty(user.id?.toString())) return;

    const q = query(
      collection(db, "notification"),
      where("uid", "==", user.id.toString()),
      where("seen", "==", false),
      where("createdAt", ">", Timestamp.fromMillis(user.seenNotificationAt))
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  };

  React.useEffect(() => {
    if (isEmpty(user) || isEmpty(user.id?.toString())) return;

    getUnreadNotifications().then((count) => {
      setUnreadNotifications(count);
    });
  }, [user]);

  const handleLogout = () => {
    dispatch(setUser({}));
    navigate("/login");
  };

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={"unset"}
      px="10px"
      py="6px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      {/* <SearchBar mb={"unset"} me="10px" borderRadius="30px" /> */}
      <SidebarResponsive routes={routes} />
      <Center p="6px">
        <Icon
          as={MdNotificationsNone}
          color={navbarIcon}
          w="18px"
          h="18px"
          me="10px"
          cursor={"pointer"}
          onClick={() => navigate("/admin/notifications")}
        />
      </Center>

      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            name={userFullnameOrUsername(user)}
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList boxShadow={shadow} p="0px" mt="10px" borderRadius="20px" bg={menuBg} border="none">
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              {`👋  Hey, ${userFullnameOrUsername(user)}`}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              onClick={() => navigate("/preference")}
            >
              <Text fontSize="sm">Profile Settings</Text>
            </MenuItem>
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={handleLogout}
            >
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func
};
