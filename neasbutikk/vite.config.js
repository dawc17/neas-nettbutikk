import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sentryVitePlugin({
    org: "dawid-krystian-czaplicki",
    project: "neasnettbutikk"
  })],
  server: {
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons': ['react-icons'],
          'firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage']
        }
      }
    },

    chunkSizeWarningLimit: 500,
    sourcemap: true
  }
})