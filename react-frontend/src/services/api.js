import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401 && !error.config.url.includes('/auth/login')) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = '/login';
      }

      const errorMessage = error.response.data?.message || 'Có lỗi xảy ra';
      console.error('API Error:', errorMessage);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
      return Promise.reject({ message: 'Không thể kết nối đến server' });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default api;
