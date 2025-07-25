import ky from 'ky';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10000,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    beforeError: [
      async (error) => {
        const { request, response } = error;
        // ログインエンドポイント以外で401が発生した場合のみログアウト
        if (response?.status === 401 && !request.url.includes('/auth/admin/login')) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return error;
      },
    ],
  },
});

// API関数
export const authApi = {
  login: (username: string, password: string) =>
    api.post('auth/admin/login', { json: { username, password } }),
  me: () => api.get('auth/admin/me'),
  logout: () => api.post('auth/logout'),
  createAdmin: (data: { username: string; email: string; password: string; name: string }) =>
    api.post('auth/admin/create', { json: data }),
};

export const adminApi = {
  getDashboard: () => api.get('admin/dashboard'),
  getUsers: () => api.get('admin/users'),
  getUser: (id: string) => api.get(`admin/users/${id}`),
  getStores: () => api.get('admin/stores'),
  getStore: (id: string) => api.get(`admin/stores/${id}`),
};
