const TOKEN_KEY = 'quantum_token'
const USER_KEY = 'quantum_user'

const listeners = new Set()

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.username) return null
    return parsed
  } catch {
    return null
  }
}

let currentUser = readStoredUser()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function login(user) {
  const safeUser = {
    id: Number(user.id),
    username: user.username,
    email: user.email || '',
  }
  localStorage.setItem(TOKEN_KEY, 'mock-jwt-token')
  localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
  currentUser = safeUser
  emit()
  return safeUser
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  currentUser = null
  emit()
}

export function getCurrentUser() {
  return currentUser
}

export function isAuthenticated() {
  return currentUser !== null
}
