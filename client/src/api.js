// Shared axios instance - all API calls go through here
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxies /api -> http://localhost:5000 in dev
  headers: { 'Content-Type': 'application/json' },
});

export default api;