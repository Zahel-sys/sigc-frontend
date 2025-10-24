import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/doctores': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/especialidades': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/horarios': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/citas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/usuarios': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
