import { isEmpty, upperFirst } from "lodash";
import { Permission } from "./types";
import dayjs from "dayjs";

export const randomString = (length: number): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const userFullnameOrUsername = (
  user: any,
  isFullName: boolean = false
) => {
  if (isEmpty(user)) return "";

  const { firstname, lastname, username } = user;

  if (isEmpty(firstname) && isEmpty(lastname)) return username;

  return isFullName
    ? `${upperFirst(firstname) ?? ""} ${upperFirst(lastname) ?? ""}`
    : `${upperFirst(firstname) ?? ""}${
        lastname ? ` ${upperFirst(lastname[0])}.` : ""
      }`;
};

export const userFullname = (user: any, isFullName: boolean = false) => {
  if (isEmpty(user)) return "";

  const { firstname, lastname } = user;

  return isFullName
    ? `${upperFirst(firstname) ?? ""} ${upperFirst(lastname) ?? ""}`
    : `${upperFirst(firstname) ?? ""}${
        lastname ? ` ${upperFirst(lastname[0])}.` : ""
      }`;
};

export const getErrorMessage = (error: any) => {
  let message = "Something when wrong! Please try again.";
  if (error instanceof Error) message = error.message;
  if (typeof error === "string") message = error.toString();
  if (typeof error === "object")
    message = error.response
      ? error.response.data.errors[0].message
      : error.toString();
  return message;
};

export const isHasPermission = (
  permissions: Permission[],
  resource: string,
  action?: string
) => {
  const hasResource = permissions?.some(
    (p) => p.resource === "*" || (p.resource === resource && (p.action === "*" || p.action === "list"))
  );
  if (!hasResource) return false;

  if (!action) return true;

  const hasAction = permissions?.some((p) => {
    if (p.action === "*") return true;
    if (typeof p.action === "string")
      return p.action === action && p.resource === resource;
    return p.action.some((a) => a === action && p.resource === resource);
  });
  if (!hasAction) return false;

  return true;
};

export const formatNumber = (val: any) => {
  if (val === "-1") return "--";
  const numberFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
  return numberFormatter.format(parseFloat(val));
};

export const formatCurrency = (value: any): string => {
  if (value === "-1") return "--";
  let formattedValue: number;
  let suffix: string;

  if (value >= 1_000_000_000) {
    formattedValue = Math.round((value / 1_000_000_000) * 10) / 10;
    suffix = " tỷ";
  } else if (value >= 1_000_000) {
    formattedValue = Math.round((value / 1_000_000) * 10) / 10;
    suffix = " tr";
  } else {
    formattedValue = value;
    suffix = "";
  }

  return `${formattedValue}${suffix}`;
};

export const generateUpdateString = (dateString: any) => {
  const givenDate = dayjs(dateString);
  const now = dayjs();

  const diffMinutes = now.diff(givenDate, "minute");
  const diffHours = now.diff(givenDate, "hour");
  const diffDays = now.diff(givenDate, "day");
  const diffMonths = now.diff(givenDate, "month");
  const diffYears = now.diff(givenDate, "year");

  let updateString;

  if (diffYears > 0) {
    updateString = `Cập nhật ${diffYears} năm trước`;
  } else if (diffMonths > 0) {
    updateString = `Cập nhật ${diffMonths} tháng trước`;
  } else if (diffDays > 0) {
    updateString = `Cập nhật ${diffDays} ngày trước`;
  } else if (diffHours > 0) {
    updateString = `Cập nhật ${diffHours} giờ trước`;
  } else {
    updateString = `Cập nhật ${diffMinutes} phút trước`;
  }

  return updateString;
};

export const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const camelCase = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
};

export const sortByProperty = (array: any[], property: string) => {
  return array.sort(function (a, b) {
    if (a[property] < b[property]) {
      return -1;
    }
    if (a[property] > b[property]) {
      return 1;
    }
    return 0;
  });
};

export const splitTheArray = (originArray: any[], numberOfNewArray: number) => {
  const res = [];
  const numberOfRes = Math.ceil(originArray.length / numberOfNewArray);
  for (let i = 0; i < numberOfRes; i++) {
    res.push([...originArray].splice(i * numberOfNewArray, numberOfNewArray));
  }
  return res;
};

export const checkDifference = (a: number, b: number) => {
  return Math.abs(a - b) < 0.5;
};