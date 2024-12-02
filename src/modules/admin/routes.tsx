import { Icon } from "@chakra-ui/react";
import { BsBuildingsFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { IoIosDocument } from "react-icons/io";
import { MdBarChart, MdOutlineSubject } from "react-icons/md";
import MainCategoryDetail from "./pages/main-category/MainCategoryDetail";
import MainCategoryList from "./pages/main-category/MainCategoryList";
import MajorDetail from "./pages/major/MajorDetail";
import MajorList from "./pages/major/MajorList";
import PostList from "./pages/post/PostList";
import SubCategoryDetail from "./pages/sub-category/SubCategoryDetail";
import SubCategoryList from "./pages/sub-category/SubCategoryList";
import TrainingOrganizationDetail from "./pages/training-organization/TrainingOrganizationDetail";
import TrainingOrganizationList from "./pages/training-organization/TrainingOrganizationList";
import UserList from "./pages/user/UserList";
import PostDetail from "./pages/post/PostDetail";
import RoadmapList from "./pages/roadmap/RoadmapList";
import RoadmapQuestion from "./pages/roadmap/RoadmapQuestion";

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
  {
    name: "Cập nhật Chuyên ngành",
    path: "/majors/:id",
    regex: /^\/admin\/majors\/[A-Z0-9]+$/,
    resource: "majors",
    component: <MajorDetail />,
    level: 0,
    sidebar: false
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
    name: "Cập nhật Cơ sở đào tạo",
    path: "/training-organizations/:id",
    regex: /^\/admin\/training-organizations\/[A-Z0-9]+$/,
    resource: "training-organizations",
    component: <TrainingOrganizationDetail />,
    level: 0,
    sidebar: false
  },
  {
    name: "Danh sách Main category",
    path: "/main-categories",
    resource: "main-categories",
    icon: <Icon as={FaList} width="20px" height="20px" color="inherit" />,
    component: <MainCategoryList />,
    level: 0,
    sidebar: true
  },
  {
    name: "Cập nhật Main category",
    path: "/main-categories/:id",
    resource: "main-categories",
    component: <MainCategoryDetail />,
    level: 0,
    sidebar: false
  },
  {
    name: "Danh sách Sub category",
    path: "/sub-categories",
    resource: "sub-categories",
    icon: <Icon as={MdOutlineSubject} width="20px" height="20px" color="inherit" />,
    component: <SubCategoryList />,
    level: 0,
    sidebar: true
  },
  {
    name: "Cập nhật Sub category",
    path: "/sub-categories/:id",
    resource: "sub-categories",
    component: <SubCategoryDetail />,
    level: 0,
    sidebar: false
  },
  {
    name: "Danh sách bài đăng",
    path: "/posts",
    resource: "posts",
    icon: <Icon as={IoIosDocument} width="20px" height="20px" color="inherit" />,
    component: <PostList />,
    level: 0,
    sidebar: true
  },
  {
    name: "Cập nhật bài đăng",
    path: "/posts/:id",
    resource: "posts",
    component: <PostDetail />,
    level: 0,
    sidebar: false
  },
  {
    name: "Danh sách Roadmap",
    path: "/roadmaps",
    resource: "roadmaps",
    icon: <Icon as={IoIosDocument} width="20px" height="20px" color="inherit" />,
    component: <RoadmapList />,
    level: 0,
    sidebar: true
  },
  {
    name: "Cập nhật Roadmap Question",
    path: "/roadmaps/:id/questions/:questionId",
    resource: "roadmaps",
    component: <RoadmapQuestion />,
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
