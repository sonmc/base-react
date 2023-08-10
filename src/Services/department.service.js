import { APIClient } from '../helpers/api_helper';
const baseUrl = `api/departments`;
const api = new APIClient();

export const Get = () => api.get(baseUrl);
export const AddMember = (params) => api.create(baseUrl + '/add-member', params);
export const Create = (params) => api.create(baseUrl, params);
export const Delete = (params) => api.delete(baseUrl, params);
