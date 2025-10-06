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
  optimizeDeps: {
    include: ['@hookform/resolvers/zod'], // Bu ayarı koruyoruz
  },
  // ÇÖZÜM BURADA: Rollup'a bu paketi dış kaynak (node_modules'da var) olarak görmesini söylüyoruz.
  build: {
    rollupOptions: {
      external: ['@hookform/resolvers/zod'],
    },
  },
});