import { Box, Flex, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectUser } from "../../../redux/slice";
import { isHasPermission } from "../../../utils/helpers";
import routes from "../routes";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Dashboard from "../pages/dashboard/Dashboard";
import BooleanContext from "./context/ExpandContext";

// Custom Chakra theme
export default function AdminLayout(props: any) {
  const [isExpand, setIsExpand] = React.useState(true);
  const { children, ...rest } = props;
  const user = useAppSelector(selectUser);
  const [routesState, setRoutesState] = React.useState([]);

  const [fixed] = React.useState(false);
  const [activeRoute, setActiveRoute] = React.useState("Dashboard");
  let location = useLocation();

  React.useEffect(() => {
    getActiveRoute(routesState);
  }, [location]);

  React.useEffect(() => {
    if (isEmpty(user.permissions)) return;

    const finalRoutes = routes.filter((route) => {
      return isHasPermission(user.permissions, route.resource);
    });
    setRoutesState(finalRoutes);
    getActiveRoute(finalRoutes);
  }, [user]);

  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  const getActiveRoute = (routes: RoutesType[]) => {
    const flatRoutes = flattenRoutes(routes);
    for (let i = 0; i < flatRoutes.length; i++) {
      if (
        location.pathname === `/admin${flatRoutes[i].path}` ||
        (flatRoutes[i].regex && location.pathname.match(flatRoutes[i].regex))
      ) {
        setActiveRoute(flatRoutes[i].name);
        return;
      }
    }
    setActiveRoute("Chỉnh sửa");
  };
  const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(`/admin${routes[i].path}`) !== -1) {
        return routes[i].name;
      }
    }
    return activeNavbar;
  };
  const flattenRoutes = (routes: RoutesType[]): RoutesType[] => {
    return routes.reduce((acc: RoutesType[], route: RoutesType) => {
      // Thêm route hiện tại vào danh sách phẳng
      acc.push(route);
      // Nếu route có children, duyệt qua các children và thêm vào danh sách phẳng
      if (route.children) {
        acc.push(...flattenRoutes(route.children));
      }
      return acc;
    }, []);
  };
  const getRoutes = (routes: RoutesType[]): any => {
    const flatRoutes = flattenRoutes(routes);
    return flatRoutes.map((route: RoutesType, key: any) => {
      if (route.component && !route.noLayout) {
        return <Route path={route.path} element={route.component} key={key} />;
      } else {
        return null;
      }
    });
  };
  const { onOpen } = useDisclosure();

  const widthCalc = useBreakpointValue({
    base: "100%",
    lg: isExpand ? "calc(100% - 290px)" : "calc(100% - 125px)"
  });

  return (
    <Box>
      <BooleanContext.Provider value={{ isExpand, setIsExpand }}>
        <Sidebar routes={routesState} {...rest} sx={{ width: "300px" }} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: "100%", lg: widthCalc }}
          maxWidth={{ base: "100%", lg: widthCalc }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
          pt={{ base: "130px", md: "80px", xl: "80px" }}
        >
          <Navbar
            onOpen={onOpen}
            brandText={activeRoute}
            message={getActiveNavbarText(routesState)}
            fixed={fixed}
            {...rest}
          />

          {getRoute() ? (
            <Box mx="auto" p={{ base: "20px", md: "30px" }} pe="20px">
              <Routes>
                {getRoutes(routesState)}
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </Box>
          ) : null}
        </Box>
      </BooleanContext.Provider>
    </Box>
  );
}
