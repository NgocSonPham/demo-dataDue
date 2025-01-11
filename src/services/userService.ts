import { isEmpty } from "lodash";
import qs from "query-string";
import dataServiceAxios from "./baseService";
const { stringify } = qs;

const userService = {
  getAll: function (queryParams: { [key: string]: any }) {
    return dataServiceAxios.get(isEmpty(queryParams) ? `core/users` : `core/users?${stringify(queryParams)}`);
  },
  getById: function (id: number) {
    return dataServiceAxios.get(`core/users/${id}`);
  },
  update: function (id: number, data: any) {
    return dataServiceAxios.patch(`core/users/${id}`, data);
  },
  delete: function (id: number) {
    return dataServiceAxios.delete(`core/users/${id}`);
  },
  changePassword: function (data: any) {
    return dataServiceAxios.patch(`core/users/password`, data);
  },
  updateFcmToken: function (id: number, fcmToken: string) {
    return dataServiceAxios.patch(`core/users/${id}/fcm-token`, { fcmToken });
  }
};

export default userService;
