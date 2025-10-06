import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ÇÖZÜM: Rollup'ın bulamadığı harici paketi (dependency) önbelleğe alması için zorluyoruz.
  optimizeDeps: {
    include: ['@hookform/resolvers/zod'],
  },
});
