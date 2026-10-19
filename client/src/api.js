// Shared axios instance - all API calls go through here
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Use env var in production, proxy in dev
  headers: { 'Content-Type': 'application/json' },
});

export default api;