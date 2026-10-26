import { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    // Mock authentication - always succeeds
    setError('')
    navigate('/')
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
    navigate('/login')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="app-title">Вход</h1>
        </div>

        <Form onSubmit={handleLogin} className="login-form">
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
          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Войти
          </Button>
        </Form>

        <div className="login-divider">
          <span>Или</span>
        </div>

        <Form onSubmit={handleRegister} className="login-form">
          <Form.Group className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control type="text" id="reg_username" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" id="reg_email" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control type="password" id="reg_password" required />
          </Form.Group>
          <Button variant="outline-primary" type="submit" className="w-100">
            Зарегистрироваться
          </Button>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </div>
  )
}