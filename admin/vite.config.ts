import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './public/manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      manifest: manifest,
      workbox:{ 
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico}']
      }
    })
  ],
})
