import qs from "query-string";
import dataServiceAxios from "./baseService";

const specialityService = {
  getAll: function () {
    return dataServiceAxios.get(`core/specialities`);
  },
  getById: function (id: number) {
    return dataServiceAxios.get(`core/specialities/${id}`);
  }
};

export default specialityService;
