import { APIClient } from "../helpers/api_helper";
const baseUrl = `api/task-group`;
const api = new APIClient();

export const Get = () => api.get(baseUrl);
export const Create = (params) => api.create(baseUrl, params);
export const Delete = (params) => api.delete(baseUrl, params);