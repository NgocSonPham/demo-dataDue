import dataServiceAxios from "./baseService";

const authService = {
  signUpByEmailOrUsername: function (data: any) {
    return dataServiceAxios.post(`core/auth/signup/email`, data);
  },
  signInByEmailOrUsername: function (data: any) {
    return dataServiceAxios.post("core/auth/signin/email", data);
  },
};

export default authService;
