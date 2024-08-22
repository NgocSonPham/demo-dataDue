import { Box, Flex, Stack } from "@chakra-ui/react";
import SidebarBrand from "./Brand";
import SidebarLinks from "./Links";

function SidebarContent(props: { routes: RoutesType[] }) {
  const { routes } = props;
  // SIDEBAR
  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px">
      <SidebarBrand />
      <Stack direction="column" mt="8px" mb="auto">
        <Box ps="20px" pe={{ lg: "16px", "2xl": "16px" }}>
          <SidebarLinks routes={routes} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
