import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { extractUser, loginRequest, registerRequest } from '../api/authApi'
import { describeApiError, isNetworkError } from '../api/http'
import { authenticate, registerUser } from '../mock/users'
import { setCredentials } from '../store/slices/authSlice'
import { resetFilters } from '../store/slices/filtersSlice'
import { resetGates } from '../store/slices/gatesSlice'
import { setNotice, stopLoading, startLoading } from '../store/slices/uiSlice'

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
  const dispatch = useDispatch()

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
    navigate(nextMode === 'register' ? '/register' : '/login', { replace: true })
  }

  const finishAuth = (user, source, message) => {
    dispatch(setCredentials({ user, source }))
    dispatch(resetFilters())
    dispatch(resetGates())
    setSuccess(message)
    window.setTimeout(() => navigate('/'), 600)
  }

  const loginWithMock = (message) => {
    const result = authenticate(username, password)
    if (!result.ok) {
      const builder = ERROR_MESSAGES[result.reason]
      setError(builder ? builder(username.trim()) : 'Не удалось войти. Проверьте данные.')
      return
    }
    finishAuth(
      { id: Number(result.user.id), username: result.user.username, email: result.user.email || '' },
      'mock',
      `${message} Вход выполнен в демо-режиме (без бэкенда).`,
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    dispatch(startLoading(isLogin ? 'Выполняем вход…' : 'Регистрируем…'))

    const describeAuthError = (requestError) => {
      if (requestError?.response?.status === 401) return 'Неверный логин или пароль.'
      if (requestError?.response?.status === 400) {
        return 'Пользователь с таким логином или email уже существует. Войдите в аккаунт.'
      }
      return describeApiError(requestError)
    }

    try {
      if (isLogin) {
        try {
          const response = await loginRequest({ username, password })
          const user = extractUser(response, username) || { id: null, username, email: '' }
          finishAuth(user, 'api', `Вход выполнен. Добро пожаловать, ${user.username}!`)
        } catch (requestError) {
          if (isNetworkError(requestError)) {
            loginWithMock('Веб-сервис недоступен.')
          } else {
            setError(describeAuthError(requestError))
          }
        }
        return
      }

      try {
        await registerRequest({ username, email, password })
        const response = await loginRequest({ username, password })
        const user = extractUser(response, username) || { id: null, username, email }
        finishAuth(user, 'api', `Регистрация прошла успешно. Добро пожаловать, ${user.username}!`)
      } catch (requestError) {
        if (isNetworkError(requestError)) {
          const result = registerUser({ username, email, password })
          if (!result.ok) {
            const builder = ERROR_MESSAGES[result.reason]
            setError(builder ? builder() : 'Не удалось зарегистрироваться. Проверьте данные.')
          } else {
            finishAuth(
              { id: Number(result.user.id), username: result.user.username, email: result.user.email },
              'mock',
              'Регистрация прошла в демо-режиме (без бэкенда). Добро пожаловать!',
            )
          }
        } else {
          setError(describeAuthError(requestError))
        }
      }
    } finally {
      setLoading(false)
      dispatch(stopLoading())
    }
  }

  const handleLoginAsGuest = () => {
    dispatch(setNotice({ type: 'info', text: 'Вы в режиме гостя. Доступен просмотр и демо-данные.' }))
    navigate('/')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="app-title login-title">{isLogin ? 'Вход' : 'Регистрация'}</h1>
          <p className="login-subtitle">
            {isLogin
              ? 'Войдите, чтобы добавлять услуги, ставить лайки и удалять свои карточки.'
              : 'Создайте аккаунт — данные сохранятся на сервере и будут доступны после входа.'}
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
              <button type="button" className="toggle-password" onClick={() => setShowPassword((value) => !value)}>
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

        <Button variant="outline-primary" type="button" className="w-100" onClick={() => switchMode(isLogin ? 'register' : 'login')}>
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </Button>

        <Button variant="link" type="button" className="w-100 mt-2 guest-link" onClick={handleLoginAsGuest}>
          Продолжить как гость
        </Button>

        <div className="login-hint">
          Демо-аккаунты (для работы без бэкенда): <b>admin / admin123</b>, <b>user1 / user123</b>
        </div>
      </div>
    </div>
  )
}
