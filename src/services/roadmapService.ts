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
  create: function (data: any) {
    return dataServiceAxios.post(`core/roadmaps`, data);
  },
  update: function (id: number | string, data: any) {
    return dataServiceAxios.patch(`core/roadmaps/${id}`, data);
  },
  delete: function (id: number) {
    return dataServiceAxios.delete(`core/roadmaps/${id}`);
  },
  createLesson: function (id: number | string, data: any) {
    return dataServiceAxios.post(`core/roadmaps/${id}/lessons`, data);
  },
  getAllLessons: function (id: number) {
    return dataServiceAxios.get(`core/roadmaps/${id}/lessons`);
  },
  getByLessonId: function (id: number | string, lessonId: number | string) {
    return dataServiceAxios.get(`core/roadmaps/${id}/lessons/${lessonId}`);
  },
  updateLesson: function (id: number | string, lessonId: number | string, data: any) {
    return dataServiceAxios.patch(`core/roadmaps/${id}/lessons/${lessonId}`, data);
  },
  deleteLesson: function (id: number | string, lessonId: number | string) {
    return dataServiceAxios.delete(`core/roadmaps/${id}/lessons/${lessonId}`);
  },
  createQuestion: function (id: number | string, data: any) {
    return dataServiceAxios.post(`core/roadmaps/${id}/questions`, data);
  },
  getAllQuestions: function (id: number, queryParams?: { [key: string]: any }) {
    return dataServiceAxios.get(
      isEmpty(queryParams) ? `core/roadmaps/${id}/questions` : `core/roadmaps/${id}/questions?${stringify(queryParams)}`
    );
  },
  getByQuestionId: function (id: number | string, questionId: number | string) {
    return dataServiceAxios.get(`core/roadmaps/${id}/questions/${questionId}`);
  },
  updateQuestion: function (id: number | string, questionId: number | string, data: any) {
    return dataServiceAxios.patch(`core/roadmaps/${id}/questions/${questionId}`, data);
  },
  deleteQuestion: function (id: number | string, questionId: number | string) {
    return dataServiceAxios.delete(`core/roadmaps/${id}/questions/${questionId}`);
  }
};

export default roadmapService;
