import { APIClient } from '../helpers/api_helper';
const baseUrl = 'api/tasks';
const api = new APIClient();

export const Get = (params) => api.get(baseUrl, params);
export const GetOne = (params) => api.get(baseUrl + '/details', params);
export const Create = (params) => api.create(baseUrl, params);
export const Update = (params) => api.create(baseUrl, params);
export const Delete = (params) => api.delete(baseUrl, params);
