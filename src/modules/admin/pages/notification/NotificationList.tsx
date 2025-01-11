import {
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CustomCard from "../../../../components/CustomCard";

export default function NotificationList() {
  const navigate = useNavigate();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const toast = useToast();

  return <CustomCard flexDirection="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}></CustomCard>;
}
