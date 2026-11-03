const STORAGE_KEY = 'quantum_users_v1'

const DEFAULT_USERS = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123', isDefault: true },
  { id: 2, username: 'user1', email: 'user1@example.com', password: 'user123', isDefault: true },
]

function readExtraUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function buildUsers() {
  const extra = readExtraUsers().filter((user) => {
    if (!user || typeof user.username !== 'string' || typeof user.password !== 'string') return false
    return !DEFAULT_USERS.some((base) => base.username.toLowerCase() === user.username.toLowerCase())
  })

  return [...DEFAULT_USERS.map((user) => ({ ...user })), ...extra]
}

let users = buildUsers()

function persist() {
  const custom = users.filter((user) => !user.isDefault)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))
  } catch {
    // игнорируем переполнение localStorage — пользователи останутся в памяти
  }
}

function normalizeName(value) {
  return String(value || '').trim().toLowerCase()
}

export function getAllUsers() {
  return users
}

export function findUserByUsername(username) {
  const name = normalizeName(username)
  if (!name) return null
  return users.find((user) => normalizeName(user.username) === name) || null
}

export function findUserByEmail(email) {
  const mail = normalizeName(email)
  if (!mail) return null
  return users.find((user) => normalizeName(user.email) === mail) || null
}

export function authenticate(username, password) {
  const user = findUserByUsername(username)

  if (!user) {
    return { ok: false, reason: 'no-user' }
  }
  if (user.password !== String(password)) {
    return { ok: false, reason: 'wrong-password' }
  }

  return { ok: true, user }
}

export function registerUser({ username, email, password }) {
  const name = String(username || '').trim()
  const mail = String(email || '').trim()
  const pass = String(password || '')

  if (name.length < 3) {
    return { ok: false, reason: 'short-username' }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
    return { ok: false, reason: 'bad-email' }
  }
  if (pass.length < 5) {
    return { ok: false, reason: 'short-password' }
  }
  if (findUserByUsername(name)) {
    return { ok: false, reason: 'username-exists' }
  }
  if (findUserByEmail(mail)) {
    return { ok: false, reason: 'email-exists' }
  }

  const newUser = {
    id: Date.now(),
    username: name,
    email: mail,
    password: pass,
  }

  users = [...users, newUser]
  persist()

  return { ok: true, user: newUser }
}
