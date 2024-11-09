import { isEmpty } from "lodash";
import qs from "query-string";
import dataServiceAxios from "./baseService";
const { stringify } = qs;

const roadmapService = {
  getAll: function (queryParams: { [key: string]: any }) {
    return dataServiceAxios.get(isEmpty(queryParams) ? `core/roadmaps` : `core/roadmaps?${stringify(queryParams)}`);
  },
  getById: function (id: number) {
    return dataServiceAxios.get(`core/roadmaps/${id}`);
  },
  getAllQuestion: function (id: number) {
    return dataServiceAxios.get(`core/roadmaps/${id}/questions`);
  }
};

export default roadmapService;
