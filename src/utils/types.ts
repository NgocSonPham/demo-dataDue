import { IconType } from "react-icons";

export type User = {
  id: number,
  firstname: string,
  lastname: string,
  username: string,
  displayname: string,
  email: string,
  phone: string,
  roleId: string,
  permissions: any,
  accessToken: string;
  refreshToken: string;
  userProfile: any;
};

export type NavItem = {
  id?: string;
  label: string;
  href?: string;
  isDisabled?: boolean;
  title?: string;
  func?: () => void;
  iconURL?: string;
  iconType?: IconType;
  status?: string;
};

export type ImgItem = {
  alt: string;
  src: string;
  href?: string;
  isDisabled?: boolean;
  height?: string
};

export type Coordinates = {
  top?: any,
  right?: any,
  bottom?: any,
  left?: any
}

export enum RequestStatus {
  INITIAL = 'INITIAL',
  REQUEST = 'REQUEST',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}

export type ActionAttributes = "*" | "create" | "read" | "update" | "delete" | "list" | "upload" | "download";

export type Permission = {
  resource: string;
  action: ActionAttributes | ActionAttributes[];
};