import dataServiceAxios from "./baseService";

const uploadService = {
  upload: function (data: FormData) {
    return dataServiceAxios.post(`core/uploads`, data);
  },
};

export default uploadService;
