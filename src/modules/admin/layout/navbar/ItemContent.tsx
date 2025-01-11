import { Icon, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { MdUpgrade } from "react-icons/md";

export function ItemContent({ info, read = false }: { info: string; read?: boolean }) {
  const textColor = useColorModeValue("navy.700", "white");
  return (
    <>
      <Flex flexDirection="column">
        <Text mb="5px" fontWeight={read ? "500" : "700"} color={textColor} fontSize={{ base: "md", md: "md" }}>
          New Update: {info}
        </Text>
        <Flex alignItems="center">
          <Text fontSize={{ base: "sm", md: "sm" }} fontWeight={read ? "400" : "600"} lineHeight="100%" color={textColor}>
            A new update for your downloaded item is available!
          </Text>
        </Flex>
      </Flex>
    </>
  );
}
