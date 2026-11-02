import { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { login as doLogin } from '../auth'
import { USERS_MOCK, findUser, registerUser } from '../mock/users'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    setTimeout(() => {
      if (mode === 'login') {
        const user = findUser(username, password)
        if (user) {
          doLogin('fake-jwt-token', { id: user.id, username: user.username, email: user.email })
          setLoading(false)
          setSuccess('Вход выполнен успешно! Добро пожаловать, ' + user.username + '.')
          setTimeout(() => navigate('/'), 1200)
        } else {
          const userExists = USERS_MOCK.find(u => u.username === username)
          if (!userExists) {
            setLoading(false)
            setError('Нет пользователя с таким логином. Зарегистрируйтесь.')
          } else {
            setLoading(false)
            setError('Неверный пароль. Попробуйте ещё раз.')
          }
        }
      } else {
        const existing = USERS_MOCK.find(u => u.username === username || u.email === email)
        if (existing) {
          setLoading(false)
          setError('Пользователь с таким логином или email уже существует.')
        } else {
          const newUser = registerUser(username, email, password)
          doLogin('fake-jwt-token', { id: newUser.id, username: newUser.username, email: newUser.email })
          setLoading(false)
          setSuccess('Регистрация прошла успешно! Добро пожаловать, ' + newUser.username + '.')
          setTimeout(() => navigate('/'), 1200)
        }
      }
    }, 800)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="app-title">{mode === 'login' ? 'Вход' : 'Регистрация'}</h1>
        </div>

        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          {mode === 'register' && (
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                id="reg_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <div className="password-input">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Скрыть' : 'Показать'}
              </button>
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Загрузка...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
          </Button>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className="login-divider">
          <span>{mode === 'login' ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'}</span>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary w-100 mt-2"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </div>
    </div>
  )
}