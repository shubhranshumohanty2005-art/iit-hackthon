import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login/register page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Asteroids API
export const asteroidsAPI = {
  getFeed: (startDate, endDate) => 
    api.get('/asteroids/feed', { params: { start_date: startDate, end_date: endDate } }),
  getById: (id) => api.get(`/asteroids/${id}`),
  browse: (page = 0, size = 20) => 
    api.get('/asteroids/browse', { params: { page, size } }),
  getAll: () => api.get('/asteroids/browse', { params: { page: 0, size: 100 } }), // Fetch larger set for viewer
};

// Watchlist API
export const watchlistAPI = {
  getWatchlist: () => api.get('/watchlist'),
  addToWatchlist: (asteroidId) => api.post('/watchlist', { asteroidId }),
  removeFromWatchlist: (id) => api.delete(`/watchlist/${id}`),
  updateAlertSettings: (id, settings) => api.put(`/watchlist/${id}/alerts`, settings),
};

// Alerts API
export const alertsAPI = {
  getAlerts: (unread = false) => api.get('/alerts', { params: { unread } }),
  markAsRead: (id) => api.put(`/alerts/${id}/read`),
  deleteAlert: (id) => api.delete(`/alerts/${id}`),
  markAllAsRead: () => api.put('/alerts/read-all'),
};

export default api;
