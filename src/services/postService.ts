import { isEmpty } from "lodash";
import dataServiceAxios from "./baseService";

const postService = {
  getAll: function (queryParams: { [key: string]: any }, page: number, pageSize: number) {
    return dataServiceAxios.get(
      `core/posts?page=${page}&pageSize=${pageSize}${isEmpty(queryParams) ? `` : `&filter=${encodeURIComponent(JSON.stringify(queryParams))}`}`
    );
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
  }
};

export default postService;
