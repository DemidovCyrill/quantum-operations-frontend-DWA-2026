import { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { isAuthenticated } from '../auth'

export default function AddPage() {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [angleX, setAngleX] = useState(0)
  const [angleY, setAngleY] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const isAuth = isAuthenticated()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAuth) return

    setSubmitting(true)
    setMessage('')
    setMessageType('')

    setTimeout(() => {
      setSubmitting(false)
      setMessage('Гейт "' + title + '" успешно опубликован!')
      setMessageType('success')
      setTimeout(() => {
        window.location.href = '/feed'
      }, 1200)
    }, 1000)
  }

  if (!isAuth) {
    return (
      <div className="page-content">
        <div className="header">
          <h1 className="app-title">Добавление</h1>
        </div>
        <div className="add-blocked">
          <h2>⚠ Вы не можете опубликовать гейт — сначала зарегистрируйтесь</h2>
          <p>Чтобы добавить квантовый вентиль, необходимо войти в аккаунт.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
            <Button variant="primary" onClick={() => window.location.href = '/login'}>
              Войти
            </Button>
            <Button variant="outline-primary" onClick={() => window.location.href = '/login'}>
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="header">
        <h1 className="app-title">{step === 1 ? 'Новая заявка' : 'Публикация'}</h1>
      </div>

      {message && (
        <div className={`alert alert-${messageType} mt-3`}>{message}</div>
      )}

      <Form onSubmit={handleSubmit} className="add-form">
        <div className="form-section">
          {step === 1 ? (
            <>
              <Form.Label className="field-label">Название</Form.Label>
              <Form.Control
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Form.Label className="field-label">Фото</Form.Label>
              <Form.Control type="file" id="image" accept="image/*" />
              <Form.Label className="field-label">Видео</Form.Label>
              <Form.Control type="file" id="video" accept="video/*" />
            </>
          ) : (
            <>
              <Form.Label className="field-label">Название</Form.Label>
              <Form.Control type="text" id="title" value={title} readOnly />
              <Form.Label className="field-label">Фото</Form.Label>
              <Form.Control type="file" id="image" accept="image/*" />
              <Form.Label className="field-label">Видео</Form.Label>
              <Form.Control type="file" id="video" accept="video/*" />
              <Form.Label className="field-label">Краткое описание</Form.Label>
              <Form.Control as="textarea" id="summary" rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} required />
              <Form.Label className="field-label">Угол X (0–180)</Form.Label>
              <Form.Control type="number" id="angle_x" min="0" max="180" value={angleX} onChange={(e) => setAngleX(parseInt(e.target.value) || 0)} />
              <Form.Label className="field-label">Угол Y (0–180)</Form.Label>
              <Form.Control type="number" id="angle_y" min="0" max="180" value={angleY} onChange={(e) => setAngleY(parseInt(e.target.value) || 0)} />
            </>
          )}
          <Button variant="primary" type="submit" className="w-100 mt-3" disabled={submitting}>
            {submitting ? 'Загрузка...' : (step === 1 ? 'Далее' : 'Опубликовать')}
          </Button>
        </div>
      </Form>
    </div>
  )
}