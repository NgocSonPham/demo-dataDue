import { Flex, HStack, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { HSeparator } from "../../../../components/Separator";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import BooleanContext from "../context/ExpandContext";

export function SidebarBrand() {
  let logoColor = useColorModeValue("navy.700", "white");
  const navigate = useNavigate();
  const { isExpand, setIsExpand } = useContext(BooleanContext);

  return (
    <Flex alignItems="center" flexDirection="column">
      <HStack spacing="10px" mt="20px" mb="30px" cursor={"pointer"} onClick={() => navigate("/")}>
        {
          isExpand ?
          <Image src={"/logo.svg"} w="40px" h="40px" />
          :
          <Image ml='-8px' src={"/logo.svg"} w="40px" h="40px" />
        }
        
        {isExpand &&
          <Text fontSize="3xl" fontWeight={800} color={logoColor}>
            {"Data Dude"}
          </Text>
        }
      </HStack>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
