import { firebaseAuthen } from "../utils/firebase";
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
  },
  signInByGoogle: function (data: any) {
    return dataServiceAxios.post(`core/auth/signin/google`, data);
  },
  doFirebaseAuth: async function () {
    try {
      const {
        data: { data: token }
      } = await dataServiceAxios.get(`core/auth/firebase-token`);

      const rs = await firebaseAuthen(token);
      return {
        auth: true,
        db: rs.db
      };
    } catch (ex) {
      return { auth: false };
    }
  }
};

export default authService;
