import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    process: { env: {} },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        '**/*.png',
        '**/*.ico',
        '**/*.svg',
        '**/*.gif',
        '**/*.jpg',
        '**/*.jpeg',
      ],
      manifest: {
        short_name: 'FITZvrh-reborn',
        name: 'FITZvrh-roborn',
        description:
          'Kompletni react rozvrh rychlokvaska z leaknutyho rozvrhu na CVUT FIT - reborn',
        icons: [
          {
            src: '/icon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        id: 'fitzvrh-roborn',
        start_url: '/',
        display: 'standalone',
        theme_color: '#212529',
        background_color: '#212529',
      },
      devOptions: {
        enabled: true,
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api/], // Don't intercept any API calls
      },
      scope: '',
    }),
  ],
  build: {
    outDir: 'build',
  },
});
