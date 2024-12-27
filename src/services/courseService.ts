import dataServiceAxios from "./baseService";

const courseService = {
  create: function (data: any) {
    return dataServiceAxios.post(`core/courses`, data);
  },
  getById: function (id: number) {
    return dataServiceAxios.get(`core/courses/${id}`);
  },
  update: function (id: number | string, data: any) {
    return dataServiceAxios.patch(`core/courses/${id}`, data);
  },
  delete: function (id: number | string) {
    return dataServiceAxios.delete(`core/courses/${id}`);
  },
  createLevel: function (id: number | string, data: any) {
    return dataServiceAxios.post(`core/courses/${id}`, data);
  },
  getAllLevels: function (id: number | string) {
    return dataServiceAxios.get(`core/courses/${id}/levels`);
  },
  updateLevel: function (id: number | string, levelId: number, data: any) {
    return dataServiceAxios.patch(`core/courses/${id}/levels/${levelId}`, data);
  },
  deleteLevel: function (id: number | string, levelId: number) {
    return dataServiceAxios.delete(`core/courses/${id}/levels/${levelId}`);
  }
};

export default courseService;
