import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', "/assets/images/book.jpg", "/assets/images/coffee.svg", "/assets/images/snowdrops.webp"],
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,woff2, svg, webp}'],  // Cachar fler filtyper
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/yourcdn\.com\/.*\.(png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      manifest: {
        name: 'MJs FlowerPot - Din handelsträdgård, bokhandel och café.',
        short_name: 'MJs FlowerPot',
        start_url: ".",
        display: "standalone",
        theme_color: '#ffffff',
        icons: [
            {
                src: 'pwa-64x64.png',
                sizes: '64x64',
                type: 'image/png'
            },
            {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: 'maskable-icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ],
      },
    })
  ],
})
