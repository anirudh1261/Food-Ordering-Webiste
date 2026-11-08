import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// In production, always use relative '/api' unless a valid remote HTTPS API is provided
if (import.meta.env.PROD && (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1'))) {
  API_BASE_URL = '/api';
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodie_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 unauthorized, we can log or clear token if expired
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login attempt failure
      if (!error.config.url.includes('/auth/login')) {
        // localStorage.removeItem('foodie_token');
        // localStorage.removeItem('foodie_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

