import { isEmpty } from "lodash";
import qs from "query-string";
import dataServiceAxios from "./baseService";
const { stringify } = qs;

const mainCategoryService = {
  getAll: function (queryParams?: { [key: string]: any }) {
    return dataServiceAxios.get(isEmpty(queryParams) ? `core/main-categories` : `core/main-categories?${stringify(queryParams)}`);
  },
  getById: function (id: number | string) {
    return dataServiceAxios.get(`core/main-categories/${id}`);
  },
  dashboard: function (id: number | string) {
    return dataServiceAxios.get(`core/main-categories/${id}/dashboard`);
  },
  create: function (data: any) {
    return dataServiceAxios.post(`core/main-categories`, data);
  },
  update: function (id: number | string, data: any) {
    return dataServiceAxios.patch(`core/main-categories/${id}`, data);
  },
  delete: function (id: number) {
    return dataServiceAxios.delete(`core/main-categories/${id}`);
  },
};

export default mainCategoryService;
