import dataServiceAxios from "./baseService";

const specialityService = {
  getAll: function () {
    return dataServiceAxios.get(`core/specialities`);
  },
  getById: function (id: number) {
    return dataServiceAxios.get(`core/specialities/${id}`);
  },
  getAllCourses: function (id: number) {
    return dataServiceAxios.get(`core/specialities/${id}/courses`);
  }
};

export default specialityService;
