import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['moon.svg'],
      manifest: {
        name: 'SkyLove Cycle',
        short_name: 'SkyLove',
        description: 'Track every cycle with love.',
        theme_color: '#FF6B9A',
        background_color: '#FFF8FC',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/moon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});
