import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Detect if running in Docker
const isDocker = process.env.NODE_ENV === 'production' || process.env.DOCKER === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: isDocker ? '0.0.0.0' : true, // Bind to all interfaces in Docker
    port: 5173,
    strictPort: true, // Fail if port is already in use
    watch: {
      usePolling: isDocker, // Use polling in Docker for volume mounts
      interval: isDocker ? 1000 : undefined, // Polling interval in Docker
    },
    hmr: isDocker ? {
      clientPort: 5173, // HMR client port for Docker
    } : undefined,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
