import axios from "axios";
import { isEmpty } from "lodash";
import { setUser } from "../redux/slice";
import { store } from "../redux/store";
import { User } from "../utils/types";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQVBJIGtleSBmb3IgZGF0YWR1ZGUgZGV2IiwidHlwZSI6InRlc3QiLCJlbnYiOiJkZXYiLCJpYXQiOjE3MjQyMjEwNDZ9.n56QHqPd6Fku3TAl_9QC6Jo0mFe5foZtic-tTeXBTYI";

const dataServiceAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
});

dataServiceAxios.interceptors.request.use(async function (config) {
  config.headers["api-token"] = API_TOKEN;

  const currentUser = store.getState().app.user;
  if (isEmpty(currentUser)) return config;
  config.headers.authorization = `Bearer ${currentUser.accessToken}`;
  return config;
});

dataServiceAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check if it was a 401 error (access token expired)
    // Also check that this is not already a retry request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // You can dispatch a Redux action here to refresh the token
      // In this example we will just call a refreshToken() function
      const currentUser = store.getState().app.user;
      if (isEmpty(currentUser)) return Promise.reject(error);

      const refreshToken = currentUser.refreshToken;
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const api = axios.create({
          baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
          headers: {
            "api-token": API_TOKEN,
            "refresh-token": refreshToken,
          },
        });
        const response = await api.post("core/auth/refresh-token");
        if (response.status === 201) {
          const { data: { data: user } = {} } = response;
          // save the new access token
          store.dispatch(setUser(user));
          // Modify the original request's authorization header
          originalRequest.headers.authorization = "Bearer " + user.accessToken;
          return dataServiceAxios(originalRequest);
        } else {
          store.dispatch(setUser({} as User));
          return Promise.reject(error);
        }
      } catch (ex) {
        store.dispatch(setUser({} as User));
        return Promise.reject(ex);
      }
    }
    // TODO: handle trường hợp refesh token không hợp lệ hoặc không server trả về không tìm thấy user
    return Promise.reject(error);
  }
);

export default dataServiceAxios;
