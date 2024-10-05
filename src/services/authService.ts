import dataServiceAxios from "./baseService";

const authService = {
  signUpByEmailOrUsername: function (data: any) {
    return dataServiceAxios.post(`core/auth/signup/email`, data);
  },
  signInByEmailOrUsername: function (data: any) {
    return dataServiceAxios.post("core/auth/signin/email", data);
  },
  signInByApple: function (data: any) {
    return dataServiceAxios.post(`core/auth/signin/apple`, data);
  }
};

export default authService;
