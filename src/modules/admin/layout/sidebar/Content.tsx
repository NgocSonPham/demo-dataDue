import { Box, Flex, Stack } from "@chakra-ui/react";
import SidebarBrand from "./Brand";
import SidebarLinks from "./Links";
import { RiExpandLeftRightFill } from "react-icons/ri";
import { useContext } from "react";
import BooleanContext from "../context/ExpandContext";

function SidebarContent(props: { routes: RoutesType[] }) {
  const { routes } = props;
  const { isExpand, setIsExpand } = useContext(BooleanContext);
  // SIDEBAR
  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px">
      <SidebarBrand />
      <Stack direction="column" mt="8px" mb="auto">
        <Box ps="20px" pe={{ lg: "16px", "2xl": "16px" }}>
          <SidebarLinks routes={routes} />
        </Box>
      </Stack>

      <Flex
        justifyContent="flex-end"
        pr={10}
        pb={5}
      >
        <Box
          background="#46056d"
          borderRadius="md"
          p={1}
          onClick={() => setIsExpand((prev) => !prev)}
        >
        <RiExpandLeftRightFill
          color="white"
          size={30}
          cursor={"pointer"}
        /></Box>
      </Flex>
    </Flex>
  );
}

export default SidebarContent;
