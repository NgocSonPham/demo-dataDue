import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GoChevronDown, GoChevronUp, GoDotFill } from "react-icons/go";
import { NavLink, useLocation } from "react-router-dom";

export function SidebarLinks(props: { routes: RoutesType[] }) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return location.pathname === "/admin" && routeName === "/default"
      ? true
      : location.pathname.includes(routeName);
  };

  const createLinkContent = (route: RoutesType, isOpen?: boolean) => {
    if (route.icon) {
      return (
        <Box>
          <HStack
            spacing={activeRoute(route.path.toLowerCase()) ? "22px" : "26px"}
            py="5px"
            ps="10px"
          >
            <Flex w="100%" alignItems="center" justifyContent="center">
              <Box
                color={
                  activeRoute(route.path.toLowerCase()) ? activeIcon : textColor
                }
                me="18px"
              >
                {route.icon}
              </Box>
              <Text
                me="auto"
                color={
                  activeRoute(route.path.toLowerCase())
                    ? activeColor
                    : textColor
                }
                fontWeight={
                  activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                }
              >
                {route.name}
              </Text>
            </Flex>
            {!route.children && (
              <Box
                h="36px"
                w="4px"
                bg={
                  activeRoute(route.path.toLowerCase()) && route.level === 0
                    ? "brand.400"
                    : "transparent"
                }
                borderRadius="5px"
              />
            )}
            {route.children && (
              <Center w="60px" h="30px">
                <Icon
                  as={isOpen ? GoChevronUp : GoChevronDown}
                  width="20px"
                  height="20px"
                  color={
                    activeRoute(route.path.toLowerCase())
                      ? activeColor
                      : textColor
                  }
                />
              </Center>
            )}
          </HStack>
        </Box>
      );
    } else {
      return (
        <Box>
          <HStack
            spacing={activeRoute(route.path.toLowerCase()) ? "22px" : "26px"}
            py="5px"
            ps="10px"
          >
            <Flex w="100%" alignItems="center" justifyContent="center">
              {route.level >= 2 && (
                <Box
                  color={
                    activeRoute(route.path.toLowerCase())
                      ? activeIcon
                      : textColor
                  }
                  me="8px"
                >
                  <Icon
                    as={GoDotFill}
                    width="10px"
                    height="10px"
                    color="inherit"
                  />
                </Box>
              )}
              <Text
                me="auto"
                color={
                  activeRoute(route.path.toLowerCase())
                    ? activeColor
                    : inactiveColor
                }
                fontWeight={
                  activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                }
              >
                {route.name}
              </Text>
            </Flex>
            {!route.children && (
              <Box
                h="36px"
                w="4px"
                bg={
                  activeRoute(route.path.toLowerCase()) && route.level === 0
                    ? "brand.400"
                    : "transparent"
                }
                borderRadius="5px"
              />
            )}
            {route.children && (
              <Center w="60px" h="30px">
                <Icon
                  as={isOpen ? GoChevronUp : GoChevronDown}
                  width="20px"
                  height="20px"
                  color="inherit"
                />
              </Center>
            )}
          </HStack>
        </Box>
      );
    }
  };

  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const onToggle = (routePath: string) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(routePath)
        ? prevOpenItems.filter((item) => item !== routePath)
        : [...prevOpenItems, routePath]
    );
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes: RoutesType[]) => {
    return routes.map((route: RoutesType, index: number) => {
      const isOpen = openItems.includes(route.path);
      if (route.sidebar) {
        return (
          <Box key={index}>
            {route.component ? (
              <NavLink to={`/admin${route.path}`}>
                {createLinkContent(route)}
              </NavLink>
            ) : (
              <Box
                cursor={"pointer"}
                onClick={() => {
                  if (route.children) onToggle(route.path);
                }}
              >
                {createLinkContent(route, isOpen)}
              </Box>
            )}
            {route.children && isOpen && (
              <Box ps={route.level === 0 ? "38px" : "10px"}>
                {createLinks(route.children)}
              </Box>
            )}
          </Box>
        );
      }
    });
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
