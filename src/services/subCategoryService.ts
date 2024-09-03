import { isEmpty } from "lodash";
import qs from "query-string";
import dataServiceAxios from "./baseService";
const { stringify } = qs;

const subCategoryService = {
  getAll: function (queryParams: { [key: string]: any }) {
    return dataServiceAxios.get(isEmpty(queryParams) ? `core/sub-categories` : `core/sub-categories?${stringify(queryParams)}`);
  },
  getById: function (id: number | string) {
    return dataServiceAxios.get(`core/sub-categories/${id}`);
  },
  dashboard: function (id: number | string) {
    return dataServiceAxios.get(`core/sub-categories/${id}/dashboard`);
  },
  create: function (data: any) {
    return dataServiceAxios.post(`core/sub-categories`, data);
  },
  update: function (id: number | string, data: any) {
    return dataServiceAxios.patch(`core/sub-categories/${id}`, data);
  },
  delete: function (id: number) {
    return dataServiceAxios.delete(`core/sub-categories/${id}`);
  },
};

export default subCategoryService;
