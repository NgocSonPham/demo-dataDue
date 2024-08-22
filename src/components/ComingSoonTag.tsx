import { Box, HStack, Text } from "@chakra-ui/react";

const ComingSoonTag = ({
  position,
  top,
  right,
  bottom,
  left,
  transform,
}: any) => {
  return (
    <HStack
      w="fit-content"
      spacing={"4px"}
      px="6px"
      py="2px"
      bg="#FF2C4C"
      rounded="full"
      position={position}
      top={top}
      right={right}
      bottom={bottom}
      left={left}
      transform={transform}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
    >
      <Box w="8px" h="8px" rounded={"full"} bg={"white"} />
      <Text
        fontSize={{ base: "8px", md: "10px" }}
        color="white"
        whiteSpace={"nowrap"}
      >
        {"Coming soon"}
      </Text>
    </HStack>
  );
};

export default ComingSoonTag;
