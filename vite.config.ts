import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Адреса веб-сервиса и S3-хранилища (MinIO) вынесены в переменные окружения.
// В dev-режиме запросы идут через обратный прокси Vite, поэтому браузер
// обращается только к origin фронтенда — это решает проблему CORS.
const API_TARGET = process.env.VITE_API_PROXY || 'http://127.0.0.1:8000'
const S3_TARGET = process.env.VITE_S3_PROXY || 'http://127.0.0.1:9000'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    proxy: {
      // Основной маршрут AJAX: /api -> FastAPI
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
      // Загруженные пользователем файлы (локальное хранилище бэкенда)
      '/static/uploads': {
        target: API_TARGET,
        changeOrigin: true,
      },
      // Второй маршрут: S3/MinIO -> /s3/<bucket>/<object>
      '/s3': {
        target: S3_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3/, ''),
      },
    },
  },
})
