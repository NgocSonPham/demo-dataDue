import { isEmpty } from "lodash";
import qs from "query-string";
import dataServiceAxios from "./baseService";
const { stringify } = qs;

const majorService = {
  getAll: function (queryParams: { [key: string]: any }) {
    return dataServiceAxios.get(
      isEmpty(queryParams)
        ? `core/majors`
        : `core/majors?${stringify(queryParams)}`
    );
  },
  getById: function (id: number | string) {
    return dataServiceAxios.get(`core/majors/${id}`);
  },
  dashboard: function (id: number | string) {
    return dataServiceAxios.get(`core/majors/${id}/dashboard`);
  },
  update: function (id: number | string, data: any) {
    return dataServiceAxios.patch(`core/majors/${id}`, data);
  },
};

export default majorService;
