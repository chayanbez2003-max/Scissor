import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Forward all /r/:slug redirect requests to Express backend (bypasses React Router)
      '/r': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Forward all /api/* API requests to Express backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
