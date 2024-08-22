import dataServiceAxios from "./baseService";

const configService = {
  getConfig: function () {
    return dataServiceAxios.get(`core/configs`);
  },
};

export default configService;
