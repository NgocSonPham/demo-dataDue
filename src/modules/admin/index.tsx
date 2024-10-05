import { isEmpty } from "lodash";
import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectUser } from "../../redux/slice";
import { USER_ROLE } from "../../utils/constants";
import AdminLayout from "./layout/AdminLayout";
import routes from "./routes";
import ReloadState from "../../components/ReloadState";

export const Admin = () => {
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  React.useEffect(() => {
    async function checkAuthorization() {
      if (isEmpty(user) && location.pathname.indexOf("/admin") !== -1) {
        return navigate("/login");
      }

      if (location.pathname.includes("/admin") && ![USER_ROLE.ADMIN, USER_ROLE.CREATOR].includes(user.roleId)) {
        return navigate("/");
      }
    }
    checkAuthorization();
  }, [user, location.pathname]);

  // Function to check if the current path matches any of the noLayoutPaths
  const shouldRenderLayout = () => {
    return !routes.some((obj) => {
      if (!obj.noLayout) return false;
      const regex = new RegExp(obj.path.replace(/:\w+/g, "\\w+"));
      return regex.test(location.pathname);
    });
  };

  return (
    <>
      <ReloadState />
      {shouldRenderLayout() && <AdminLayout />}
      <Routes>
        {routes.map((route: RoutesType, key: any) => {
          if (route.component && route.noLayout) {
            return <Route path={route.path} element={route.component} key={key} />;
          } else {
            return null;
          }
        })}
      </Routes>
    </>
  );
};
