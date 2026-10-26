import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const DEFAULT_IMAGE = '/static/img/pauli_x.png'
const DEFAULT_VIDEO = '/static/img/video.mp4'

export default function AddPage() {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [angleX, setAngleX] = useState(0)
  const [angleY, setAngleY] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      alert(`Гейт "${title}" опубликован!`)
      window.location.href = '/feed'
    }
  }

  return (
    <div className="page-content">
      <div className="header">
        <h1 className="app-title">
          {step === 1 ? 'Новая заявка' : 'Публикация'}
        </h1>
      </div>

      <Form onSubmit={handleSubmit} className="add-form">
        <div className="form-section">
          {!step ? null : step === 1 ? (
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
          <Button variant="primary" type="submit" className="w-100 mt-3">
            {step === 1 ? 'Далее' : 'Опубликовать'}
          </Button>
        </div>
      </Form>
    </div>
  )
}