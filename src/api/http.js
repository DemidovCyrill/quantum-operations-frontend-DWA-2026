import axios from 'axios'

// Единый экземпляр Axios. baseURL относительный — в dev-режиме запрос
// уходит на тот же origin и проксируется Vite (см. vite.config.ts).
export const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 20000,
})

export function isNetworkError(error) {
  // Нет ответа — сервис не запущен; 5xx — прокси Vite не смог достучаться
  // до бэкенда. В обоих случаях гостю разрешено работать с mock-коллекцией.
  return !error || !error.response || error.response.status >= 500
}

export function describeApiError(error) {
  if (!error?.response) {
    return 'Веб-сервис недоступен. Проверьте, запущен ли бэкенд на http://127.0.0.1:8000.'
  }
  const detail = error.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join('; ')
  return `Ошибка запроса (${error.response.status})`
}
