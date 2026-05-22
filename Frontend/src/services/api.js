import axios from 'axios';

// In development: relative /api path goes through the Vite proxy → Express backend.
// In production: VITE_API_BASE_URL must point to your backend (e.g. https://api.myapp.com/api).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Configure Bearer Authorization JWT injection dynamically
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
