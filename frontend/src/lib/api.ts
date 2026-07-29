import axios from 'axios';
import { storage } from './storage';

const envApiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');
const fallbackApiBaseUrl = import.meta.env.PROD ? 'https://female-cycle.onrender.com' : '';
const apiBaseUrl = envApiBaseUrl || fallbackApiBaseUrl;
const externalApi = Boolean(apiBaseUrl);
const api = axios.create({
  baseURL: externalApi ? `${apiBaseUrl}/api/` : '/api/',
  timeout: 60_000,
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
