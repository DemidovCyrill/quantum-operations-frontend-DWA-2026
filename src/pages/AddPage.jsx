import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../api/media'
import { selectIsAuth } from '../store/slices/authSlice'
import { selectIsLoading } from '../store/slices/uiSlice'
import { createGate } from '../store/thunks/gatesThunks'

const MAX_ANGLE = 180

function clampAngle(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.min(MAX_ANGLE, Math.max(0, Math.round(number)))
}

// Сжимаем фото перед сохранением, чтобы не упереться в лимит localStorage
// в демо-режиме (без бэкенда).
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
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)
  const loading = useSelector(selectIsLoading)

  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [angleX, setAngleX] = useState(0)
  const [angleY, setAngleY] = useState(0)
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [imageName, setImageName] = useState('')
  const [videoName, setVideoName] = useState('')
  const [attributes, setAttributes] = useState([{ name: '', value: '' }])
  const [error, setError] = useState('')

  if (!isAuth) {
    return (
      <div className="page-content">
        <div className="header">
          <h1 className="app-title">Добавление</h1>
        </div>

        <div className="add-blocked">
          <h2>Вы не можете опубликовать услугу</h2>
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
      setImageFile(null)
      setImageUrl('')
      setImageName('')
      return
    }

    setImageFile(file)
    setImageName(file.name)

    try {
      const dataUrl = await fileToCompressedDataUrl(file)
      setImageUrl(dataUrl)
    } catch {
      setImageUrl('')
      setError('Не удалось прочитать изображение. Попробуйте другой файл.')
    }
  }

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setVideoFile(null)
      setVideoUrl('')
      setVideoName('')
      return
    }
    setVideoFile(file)
    setVideoName(file.name)
    setVideoUrl(URL.createObjectURL(file))
  }

  const updateAttribute = (index, field, value) => {
    setAttributes((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)))
  }

  const addAttribute = () => setAttributes((prev) => [...prev, { name: '', value: '' }])
  const removeAttribute = (index) => setAttributes((prev) => prev.filter((_, itemIndex) => itemIndex !== index))

  const handleNext = () => {
    if (!title.trim()) {
      setError('Введите название услуги.')
      return
    }
    setError('')
    setStep(2)
  }

  const handlePublish = async (event) => {
    event.preventDefault()

    if (!summary.trim()) {
      setError('Добавьте краткое описание услуги.')
      return
    }

    setError('')

    const filledAttributes = attributes
      .map((item, index) => ({ id: index + 1, name: item.name.trim(), value: item.value.trim() }))
      .filter((item) => item.name)

    try {
      const gate = await dispatch(
        createGate({
          title: title.trim(),
          summary: summary.trim(),
          angleX: clampAngle(angleX),
          angleY: clampAngle(angleY),
          imageFile,
          videoFile,
          imageUrl: imageUrl || DEFAULT_IMAGE,
          videoUrl: videoUrl || DEFAULT_VIDEO,
          attributes: filledAttributes,
        }),
      ).unwrap()

      navigate(`/gates/${gate.id}`)
    } catch {
      // Текст ошибки уже показан в уведомлении (Notice).
    }
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

              <div className="attributes-editor">
                <div className="attributes-editor-head">
                  <span className="field-label">Характеристики услуги</span>
                  <button type="button" className="attr-add" onClick={addAttribute}>
                    + Добавить
                  </button>
                </div>
                <p className="attributes-hint">
                  Набор характеристик не фиксирован: добавляйте любые пары «название — значение».
                </p>

                {attributes.map((attribute, index) => (
                  <div className="attr-edit-row" key={index}>
                    <Form.Control
                      type="text"
                      placeholder="Название (например, Матрица)"
                      value={attribute.name}
                      onChange={(event) => updateAttribute(index, 'name', event.target.value)}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Значение"
                      value={attribute.value}
                      onChange={(event) => updateAttribute(index, 'value', event.target.value)}
                    />
                    <button
                      type="button"
                      className="attr-remove"
                      onClick={() => removeAttribute(index)}
                      title="Удалить характеристику"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="add-actions">
                <Button variant="outline-primary" type="button" onClick={() => setStep(1)} disabled={loading}>
                  Назад
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Публикация…' : 'Опубликовать'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Form>
    </div>
  )
}
