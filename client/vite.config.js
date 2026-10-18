import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces (IPv4 + IPv6)
    port: 5173,
    // Proxy API calls to Express during development
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});