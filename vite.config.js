import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Accept connections from any IP (needed for phone access)
    port: 5173,        // Optional: default port
    strictPort: true,  // Fail if 5173 is not available (optional)
  },
});
