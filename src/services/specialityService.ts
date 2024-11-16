import dataServiceAxios from "./baseService";

const specialityService = {
  getAll: function () {
    return dataServiceAxios.get(`core/specialities`);
  },
  getById: function (id: number) {
    return dataServiceAxios.get(`core/specialities/${id}`);
  },
  increaseLevel: function (id: number | string) {
    return dataServiceAxios.patch(`core/specialities/${id}`);
  },
  deleteLevel: function (id: number | string, levelId: number) {
    return dataServiceAxios.patch(`core/specialities/${id}/level/${levelId}`);
  }
};

export default specialityService;
