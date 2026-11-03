import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { DEFAULT_IMAGE, DEFAULT_VIDEO, addGate } from '../store/gatesStore'

const MAX_ANGLE = 180

function clampAngle(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.min(MAX_ANGLE, Math.max(0, Math.round(number)))
}

// Сжимаем фото перед сохранением в localStorage, чтобы не упереться в лимит ~5 МБ
function fileToCompressedDataUrl(file, maxSize = 640, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      try {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(objectUrl)
        resolve(canvas.toDataURL('image/jpeg', quality))
      } catch (error) {
        URL.revokeObjectURL(objectUrl)
        reject(error)
      }
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('image-load-failed'))
    }

    image.src = objectUrl
  })
}

export default function AddPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [angleX, setAngleX] = useState(0)
  const [angleY, setAngleY] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [imageName, setImageName] = useState('')
  const [videoName, setVideoName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    return (
      <div className="page-content">
        <div className="header">
          <h1 className="app-title">Добавление</h1>
        </div>

        <div className="add-blocked">
          <h2>Вы не можете опубликовать гейт</h2>
          <p>Сначала войдите или зарегистрируйтесь — публикация доступна только авторизованным пользователям.</p>
          <div className="add-blocked-actions">
            <Button variant="primary" onClick={() => navigate('/login')}>
              Войти
            </Button>
            <Button variant="outline-primary" onClick={() => navigate('/register')}>
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setImageUrl('')
      setImageName('')
      return
    }

    setImageName(file.name)

    try {
      const dataUrl = await fileToCompressedDataUrl(file)
      setImageUrl(dataUrl)
    } catch {
      setImageUrl('')
      setImageName('')
      setError('Не удалось прочитать изображение. Попробуйте другой файл.')
    }
  }

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setVideoUrl('')
      setVideoName('')
      return
    }
    setVideoName(file.name)
    setVideoUrl(URL.createObjectURL(file))
  }

  const handleNext = () => {
    if (!title.trim()) {
      setError('Введите название гейта.')
      return
    }
    setError('')
    setStep(2)
  }

  const handlePublish = (event) => {
    event.preventDefault()

    if (!summary.trim()) {
      setError('Добавьте краткое описание гейта.')
      return
    }

    setError('')
    setSubmitting(true)

    const gate = addGate({
      title: title.trim(),
      summary: summary.trim(),
      image_url: imageUrl || DEFAULT_IMAGE,
      video_url: videoUrl || DEFAULT_VIDEO,
      angle_x: clampAngle(angleX),
      angle_y: clampAngle(angleY),
      creator_id: user.id,
      creator_name: user.username,
      likes_count: 0,
      liked_by: [],
    })

    setSubmitting(false)
    navigate(`/feed/${gate.id}`)
  }

  return (
    <div className="page-content">
      <div className="header">
        <h1 className="app-title">{step === 1 ? 'Новая заявка' : 'Публикация'}</h1>
      </div>

      <div className="step-indicator">
        <span className={step === 1 ? 'step-dot step-dot-active' : 'step-dot'}>1. Название и медиа</span>
        <span className={step === 2 ? 'step-dot step-dot-active' : 'step-dot'}>2. Описание и углы</span>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="add-form" onSubmit={handlePublish}>
        <div className="form-section">
          {step === 1 ? (
            <>
              <Form.Label className="field-label">Название</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Например, Гейт Паули-X"
                required
              />

              <Form.Label className="field-label">Фото</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              {imageName && <div className="file-hint">Выбрано: {imageName}</div>}

              <Form.Label className="field-label">Видео</Form.Label>
              <Form.Control type="file" accept="video/*" onChange={handleVideoChange} />
              {videoName && <div className="file-hint">Выбрано: {videoName}</div>}

              <Button variant="primary" type="button" className="w-100 mt-3" onClick={handleNext}>
                Далее
              </Button>
            </>
          ) : (
            <>
              <Form.Label className="field-label">Название</Form.Label>
              <Form.Control type="text" value={title} readOnly />

              <Form.Label className="field-label">Краткое описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Опишите, что делает квантовый вентиль"
                required
              />

              <Form.Label className="field-label">Угол X (0–180°)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="180"
                value={angleX}
                onChange={(event) => setAngleX(event.target.value)}
              />

              <Form.Label className="field-label">Угол Y (0–180°)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="180"
                value={angleY}
                onChange={(event) => setAngleY(event.target.value)}
              />

              <div className="add-actions">
                <Button variant="outline-primary" type="button" onClick={() => setStep(1)} disabled={submitting}>
                  Назад
                </Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Публикация…' : 'Опубликовать'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Form>
    </div>
  )
}
