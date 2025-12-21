import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        url: error.config?.url,
        message: error.response.data?.message,
        data: error.response.data
      });
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network Error:', {
        url: error.config?.url,
        message: 'No response from server. Check your connection or API URL.',
        apiUrl: API_BASE_URL
      });
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
    }

    if (error.response?.status === 401) {
      // Only redirect if not already on login/register page
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';
      
      if (!isAuthPage) {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Use setTimeout to prevent immediate redirect during login
        setTimeout(() => {
          const newPath = window.location.pathname;
          if (newPath !== '/login' && newPath !== '/register') {
            window.location.replace('/login');
          }
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

