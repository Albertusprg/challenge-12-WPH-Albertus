import axios from 'axios';

export const localApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

localApi.interceptors.request.use(
  (config) => {
    // HANYA JANGAN tambahkan token ke endpoint login/register
    // Untuk endpoint LAINNYA (termasuk /posts), token HARUS ditambahkan.
    // Jadi, kondisi `!config.url.includes('/auth/')` sudah benar.
    // Yang penting adalah `localStorage.getItem('authToken')` benar-benar mengembalikan token.

    if (
      typeof window !== 'undefined' &&
      config.url &&
      !config.url.includes('/auth/')
    ) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
