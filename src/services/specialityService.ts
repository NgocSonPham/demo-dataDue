import dataServiceAxios from "./baseService";

const specialityService = {
  getAll: function () {
    return dataServiceAxios.get(`core/specialities`);
  },
  getById: function (id: number) {
    return dataServiceAxios.get(`core/specialities/${id}`);
  },
  createLevel: function (id: number | string, data: any) {
    return dataServiceAxios.post(`core/specialities/${id}`, data);
  },
  getAllLevels: function (id: number | string) {
    return dataServiceAxios.get(`core/specialities/${id}/levels`);
  },
  updateLevel: function (id: number | string, levelId: number, data: any) {
    return dataServiceAxios.patch(`core/specialities/${id}/levels/${levelId}`, data);
  },
  deleteLevel: function (id: number | string, levelId: number) {
    return dataServiceAxios.delete(`core/specialities/${id}/levels/${levelId}`);
  }
};

export default specialityService;
