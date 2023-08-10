import { APIClient } from '../helpers/api_helper';
const baseUrl = `api/reports`;
const api = new APIClient();

export const Get = (param) => api.get(baseUrl, param);
