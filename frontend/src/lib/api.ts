import axios from 'axios';
import { storage } from './storage';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');
const externalApi = Boolean(apiBaseUrl);
const api = axios.create({
  baseURL: apiBaseUrl ? `${apiBaseUrl}/api/` : '/api',
  timeout: 10_000,
});

api.interceptors.request.use((config) => {
  if (externalApi && typeof config.url === 'string') {
    config.url = config.url.replace(/^\/+/, '');
  }

  const token = storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Backend optional — gracefully fall back to local storage
    return Promise.reject(error);
  },
);

export { api };
