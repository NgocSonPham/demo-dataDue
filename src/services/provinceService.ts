import { isEmpty } from "lodash";
import qs from "query-string";
import dataServiceAxios from "./baseService";
const { stringify } = qs;

const provinceService = {
  getAll: function (queryParams?: { [key: string]: any }) {
    return dataServiceAxios.get(
      isEmpty(queryParams)
        ? `core/provinces`
        : `core/provinces?${stringify(queryParams)}`
    );
  },
  getById: function (id: number | string) {
    return dataServiceAxios.get(`core/provinces/${id}`);
  },
  update: function (id: number | string, data: any) {
    return dataServiceAxios.patch(`core/provinces/${id}`, data);
  },
  getSchools: function (listMajorId: number | string) {
    return dataServiceAxios.get(`core/provinces/schools/${listMajorId}`);
  },
};

export default provinceService;
