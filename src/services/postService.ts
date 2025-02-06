import { isEmpty, reject } from "lodash";
import qs from "query-string";
import dataServiceAxios from "./baseService";
const { stringify } = qs;

const postService = {
  getAll: function (queryParams: { [key: string]: any }) {
    return dataServiceAxios.get(isEmpty(queryParams) ? `core/posts` : `core/posts?${stringify(queryParams)}`);
  },
  getById: function (id: number | string) {
    return dataServiceAxios.get(`core/posts/${id}`);
  },
  dashboard: function (id: number | string) {
    return dataServiceAxios.get(`core/posts/${id}/dashboard`);
  },
  create: function (data: any) {
    return dataServiceAxios.post(`core/posts`, data);
  },
  update: function (id: number | string, data: any) {
    return dataServiceAxios.patch(`core/posts/${id}`, data);
  },
  delete: function (id: number) {
    return dataServiceAxios.delete(`core/posts/${id}`);
  },
  deletePermanently: function (id: number) {
    return dataServiceAxios.delete(`core/posts/${id}?hardDelete=true`);
  },
  publish: function (id: number) {
    return dataServiceAxios.post(`core/posts/${id}/publish`);
  },
  unPublish: function (id: number) {
    return dataServiceAxios.post(`core/posts/${id}/unpublish`);
  },
  approve: function (id: number) {
    return dataServiceAxios.post(`core/posts/${id}/approve`);
  },
  reject: function (id: number) {
    return dataServiceAxios.post(`core/posts/${id}/reject`);
  },
  disapprove: function (id: number) {
    return dataServiceAxios.post(`core/posts/${id}/disapprove`);
  }
};

export default postService;
