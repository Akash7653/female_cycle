import axios from 'axios';
import { storage } from './storage';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
const api = axios.create({
  baseURL: apiBaseUrl ? `${apiBaseUrl.replace(/\/+$/, '')}/api` : '/api',
  timeout: 10_000,
});

api.interceptors.request.use((config) => {
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
