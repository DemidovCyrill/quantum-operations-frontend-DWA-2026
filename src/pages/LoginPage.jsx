import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { login as saveSession } from '../auth'
import { authenticate, registerUser } from '../mock/users'

const ERROR_MESSAGES = {
  'no-user': (name) => `Пользователя с логином «${name}» не существует. Нажмите «Зарегистрироваться».`,
  'wrong-password': (name) => `Неверный пароль для пользователя «${name}». Попробуйте ещё раз.`,
  'short-username': () => 'Логин должен содержать минимум 3 символа.',
  'bad-email': () => 'Введите корректный email, например name@example.com.',
  'short-password': () => 'Пароль должен содержать минимум 5 символов.',
  'username-exists': () => 'Пользователь с таким логином уже зарегистрирован. Войдите в аккаунт.',
  'email-exists': () => 'Пользователь с таким email уже зарегистрирован. Войдите в аккаунт.',
}

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [mode, setMode] = useState(location.pathname === '/register' ? 'register' : 'login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    setSuccess('')
    setPassword('')
    setShowPassword(false)
  }

  const finishAuth = (user, message) => {
    saveSession(user)
    setLoading(false)
    setSuccess(message)
    window.setTimeout(() => navigate('/'), 700)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (isLogin) {
      const result = authenticate(username, password)

      if (!result.ok) {
        setLoading(false)
        const builder = ERROR_MESSAGES[result.reason]
        setError(builder ? builder(username.trim()) : 'Не удалось войти. Проверьте данные.')
        return
      }

      finishAuth(result.user, `Вход выполнен. Добро пожаловать, ${result.user.username}!`)
      return
    }

    const result = registerUser({ username, email, password })

    if (!result.ok) {
      setLoading(false)
      const builder = ERROR_MESSAGES[result.reason]
      setError(builder ? builder() : 'Не удалось зарегистрироваться. Проверьте данные.')
      return
    }

    finishAuth(result.user, `Регистрация прошла успешно. Добро пожаловать, ${result.user.username}!`)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="app-title login-title">{isLogin ? 'Вход' : 'Регистрация'}</h1>
          <p className="login-subtitle">
            {isLogin
              ? 'Войдите, чтобы добавлять гейты, ставить лайки и удалять свои карточки.'
              : 'Создайте аккаунт — он сохранится и будет доступен после перезагрузки страницы.'}
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </Form.Group>

          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <div className="password-input">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? 'Скрыть' : 'Показать'}
              </button>
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Подождите…' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </Form>

        {error && <Alert variant="danger" className="mt-3 mb-0">{error}</Alert>}
        {success && <Alert variant="success" className="mt-3 mb-0">{success}</Alert>}

        <div className="login-divider">
          <span>{isLogin ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'}</span>
        </div>

        <Button
          variant="outline-primary"
          type="button"
          className="w-100"
          onClick={() => switchMode(isLogin ? 'register' : 'login')}
        >
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </Button>

        <div className="login-hint">
          Демо-аккаунты: <b>admin / admin123</b>, <b>user1 / user123</b>
        </div>
      </div>
    </div>
  )
}
