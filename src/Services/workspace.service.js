import { APIClient } from '../helpers/api_helper';
const baseUrl = `api/workspaces`;
const api = new APIClient();

export const Get = () => api.get(baseUrl);
export const Create = (params) => api.create(baseUrl, params); 