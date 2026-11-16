import { http } from './http'

// Запросы авторизации/деавторизации выполняются напрямую через Axios,
// без кодогенерации и без redux-thunk: состояние в Redux передаётся вручную
// (см. LoginPage.jsx и App.jsx), как требует задание ЛР-6.

export async function loginRequest({ username, password }) {
  const { data } = await http.post('/users/login', { username, password })
  return data
}

export async function registerRequest({ username, email, password }) {
  const { data } = await http.post('/users/register', { username, email, password })
  return data
}

export async function logoutRequest() {
  const { data } = await http.post('/users/logout')
  return data
}

// Ответ бэкенда может быть обёрнут в { data: ... } — разворачиваем его.
export function extractUser(response, fallbackName = '') {
  const payload = response?.data ?? response
  if (!payload || typeof payload !== 'object') return null
  const user = payload.user ?? payload
  const username = user.username || fallbackName
  if (!username) return null
  return {
    id: Number(user.id ?? user.user_id ?? 0) || null,
    username,
    email: user.email || '',
  }
}
