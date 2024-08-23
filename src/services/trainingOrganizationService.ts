import { isEmpty } from "lodash";
import qs from "query-string";
import dataServiceAxios from "./baseService";
const { stringify } = qs;

const trainingOrganizationService = {
  getAll: function (queryParams: { [key: string]: any }) {
    return dataServiceAxios.get(
      isEmpty(queryParams) ? `core/training-organizations` : `core/training-organizations?${stringify(queryParams)}`
    );
  },
  getById: function (id: number | string) {
    return dataServiceAxios.get(`core/training-organizations/${id}`);
  },
  create: function (data: any) {
    return dataServiceAxios.post(`core/training-organizations`, data);
  },
  update: function (id: number | string, data: any) {
    return dataServiceAxios.patch(`core/training-organizations/${id}`, data);
  }
};

export default trainingOrganizationService;
