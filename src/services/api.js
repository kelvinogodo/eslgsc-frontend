// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://commission-backend-jbfq.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Public account endpoints where a 401/400 is an expected answer, not an expired session.
const AUTH_ATTEMPT = /\/auth\/(login|set-password|reset-password|forgot-password)/;

/**
 * If the server says our token is no good (expired, or signed by a different
 * server), sign out cleanly and send the operator to the login page with an
 * explanation — rather than leaving a dashboard that looks fine but can't load
 * anything. Public pages just drop the stale token quietly.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const hadToken = Boolean(localStorage.getItem('token'));

    if (status === 401 && hadToken && !AUTH_ATTEMPT.test(url)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common.Authorization;
      if (window.location.pathname.startsWith('/dashboard')) {
        try { sessionStorage.setItem('sessionExpired', '1'); } catch { /* storage unavailable */ }
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
