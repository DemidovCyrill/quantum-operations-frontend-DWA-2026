export const USERS_MOCK = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123' },
  { id: 2, username: 'user1', email: 'user1@example.com', password: 'user123' },
]

export function findUser(username, password) {
  return USERS_MOCK.find(u => u.username === username && u.password === password);
}

export function findUserByUsername(username) {
  return USERS_MOCK.find(u => u.username === username);
}

export function registerUser(username, email, password) {
  if (findUserByUsername(username)) return null;
  const newUser = { id: Date.now(), username, email, password };
  USERS_MOCK.push(newUser);
  return newUser;
}