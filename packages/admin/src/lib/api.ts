import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// リクエストインターセプター（JWTトークンを自動で追加）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（401エラーでログアウト）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ログインエンドポイント以外で401が発生した場合のみログアウト
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/admin/login')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API関数
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/admin/login', { username, password }),
  me: () => api.get('/auth/admin/me'),
  logout: () => api.post('/auth/logout'),
  createAdmin: (data: { username: string; email: string; password: string; name: string }) =>
    api.post('/auth/admin/create', data),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  getStores: () => api.get('/admin/stores'),
  getStore: (id: string) => api.get(`/admin/stores/${id}`),
};
