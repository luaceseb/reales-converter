import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: '/reales-converter/',
        name: 'Reales Converter',
        short_name: 'Reales',
        description: 'Escaneá precios en reales y convertílos aun sin conexión.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: './',
        scope: './',
        lang: 'es',
        icons: [{ src: 'pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm,gz}'],
        // OCR's Tesseract runtime and language data are intentionally precached
        // so scanning remains available while offline.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: 'index.html',
        runtimeCaching: [{
          urlPattern: /^https:\/\/api\.frankfurter\.dev\/v2\/rate\//,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'exchange-rates',
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 },
          },
        }],
      },
    }),
  ],
  base: '/reales-converter/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
