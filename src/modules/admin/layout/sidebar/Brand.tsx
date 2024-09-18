import { Flex, HStack, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { HSeparator } from "../../../../components/Separator";
import { useNavigate } from "react-router-dom";

export function SidebarBrand() {
  let logoColor = useColorModeValue("navy.700", "white");
  const navigate = useNavigate();

  return (
    <Flex alignItems="center" flexDirection="column">
      <HStack spacing="10px" mt="20px" mb="30px" cursor={"pointer"} onClick={() => navigate("/")}>
        <Image src={"/logo.svg"} w="40px" h="40px" />
        <Text fontSize="3xl" fontWeight={800} color={logoColor}>
          {"Data Dude"}
        </Text>
      </HStack>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
