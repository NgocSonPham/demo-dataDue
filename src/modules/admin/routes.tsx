import { Icon } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { MdBarChart, MdList } from "react-icons/md";
import { RiFlowChart } from "react-icons/ri";
import MajorDetail from "./pages/major/MajorDetail";
import MajorList from "./pages/major/MajorList";
import UserList from "./pages/user/UserList";
import ProvinceList from "./pages/province/ProvinceList";
import { BsBuildingsFill, BsFillPinMapFill } from "react-icons/bs";
import TrainingOrganizationList from "./pages/training-organization/TrainingOrganizationList";
import TrainingOrganizationDetail from "./pages/training-organization/TrainingOrganizationDetail";

const routes: RoutesType[] = [
  {
    name: "Danh sách Chuyên ngành",
    path: "/majors",
    resource: "majors",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <MajorList />,
    level: 0,
    sidebar: true
  },
  // {
  //   name: "Danh sách Tỉnh thành",
  //   path: "/provinces",
  //   resource: "provinces",
  //   icon: <Icon as={BsFillPinMapFill} width="20px" height="20px" color="inherit" />,
  //   component: <ProvinceList />,
  //   level: 0,
  //   sidebar: true
  // },
  {
    name: "Danh sách Cơ sở đào tạo",
    path: "/training-organizations",
    resource: "training-organizations",
    icon: <Icon as={BsBuildingsFill} width="20px" height="20px" color="inherit" />,
    component: <TrainingOrganizationList />,
    level: 0,
    sidebar: true
  },
  {
    name: "Cập nhật Chuyên ngành",
    path: "/majors/:id",
    regex: /^\/admin\/majors\/[A-Z0-9]+$/,
    resource: "majors",
    component: <MajorDetail />,
    level: 0,
    sidebar: false
  },
  {
    name: "Cập nhật Cơ sở đào tạo",
    path: "/training-organizations/:id",
    regex: /^\/admin\/training-organizations\/[A-Z0-9]+$/,
    resource: "training-organizations",
    component: <TrainingOrganizationDetail />,
    level: 0,
    sidebar: false
  },
  {
    name: "Danh sách Người dùng",
    path: "/users",
    resource: "users",
    icon: <Icon as={FaUser} width="20px" height="20px" color="inherit" />,
    component: <UserList />,
    level: 0,
    sidebar: true
  }
];

export default routes;
