import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useGates } from '../hooks/useGates'
import { DEFAULT_VIDEO, isLikedBy, toggleLike } from '../store/gatesStore'

export default function FeedPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const gates = useGates()
  const { user } = useAuth()
  const videoRef = useRef(null)

  const [currentId, setCurrentId] = useState(() => (id ? Number(id) : gates[0]?.id ?? null))

  // Переход из плитки по конкретной карточке
  useEffect(() => {
    if (id) setCurrentId(Number(id))
  }, [id])

  const index = gates.findIndex((gate) => gate.id === currentId)
  const gate = index >= 0 ? gates[index] : gates[0]

  // Держим адрес страницы в соответствии с открытым гейтом
  useEffect(() => {
    if (!gate) return
    if (id !== String(gate.id)) {
      navigate(`/feed/${gate.id}`, { replace: true })
    }
  }, [gate, id, navigate])

  // Принудительно запускаем видео после смены гейта (некоторые браузеры
  // игнорируют autoPlay у пересозданного элемента)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const promise = video.play()
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {})
    }
  }, [gate?.id])

  if (!gate) {
    return (
      <div className="feed-page">
        <div className="empty-msg">
          <p>Гейтов пока нет.</p>
          <Button variant="primary" onClick={() => navigate('/add')}>
            Добавить гейт
          </Button>
        </div>
      </div>
    )
  }

  const liked = isLikedBy(gate, user?.id)

  const handleNext = () => {
    if (gates.length < 2) return
    const nextIndex = (index + 1) % gates.length
    setCurrentId(gates[nextIndex].id)
  }

  const handleLike = () => {
    if (!user) {
      window.alert('Войдите или зарегистрируйтесь, чтобы ставить лайки.')
      return
    }
    toggleLike(gate.id, user.id)
  }

  const handleVideoError = (event) => {
    const video = event.currentTarget
    if (video.dataset.fallbackApplied === '1') return
    video.dataset.fallbackApplied = '1'
    video.src = DEFAULT_VIDEO
    video.load()
    video.play().catch(() => {})
  }

  return (
    <div className="feed-page">
      <div className="feed-header">
        <h1 className="app-title">{gate.title}</h1>
      </div>

      <div className="feed-container">
        <div className="vibes-container">
          {/*
            key={gate.id} — критично: при смене гейта React создаёт новый <video>,
            поэтому браузер гарантированно загружает новый файл, а не оставляет старый кадр.
            src задаётся прямо на <video>, без <source> — иначе смена source не перезапускает видео.
          */}
          <video
            key={gate.id}
            ref={videoRef}
            className="vibes-video"
            src={gate.video_url || DEFAULT_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={handleVideoError}
          />

          <div className="vibes-side">
            <div className="param-badge">
              <span className="param-label">X</span>
              <span className="param-value">{gate.angle_x}°</span>
            </div>
            <div className="param-badge">
              <span className="param-label">Y</span>
              <span className="param-value">{gate.angle_y}°</span>
            </div>

            <button
              type="button"
              className={`like-btn ${liked ? 'is-liked' : ''}`}
              onClick={handleLike}
              title={user ? (liked ? 'Убрать лайк' : 'Поставить лайк') : 'Войдите, чтобы поставить лайк'}
              aria-pressed={liked}
            >
              <span className="like-btn-icon">{liked ? '♥' : '♡'}</span>
              <span className="like-btn-count">{gate.likes_count}</span>
            </button>

            <button type="button" className="next-btn" onClick={handleNext} title="Следующий гейт">
              ▶
            </button>
          </div>

          <div className="vibes-bottom">
            <input type="checkbox" id={`expand-${gate.id}`} className="expand-toggle" />
            <label htmlFor={`expand-${gate.id}`} className="description-block">
              <strong>{gate.title}</strong>
              <p className="description-text">{gate.summary || 'Без описания'}</p>
              <span className="more-link">Ещё</span>
              <span className="less-link">Меньше</span>
            </label>
            <div className="feed-author">Автор: {gate.creator_name}</div>
          </div>
        </div>
      </div>

      <div className="feed-actions">
        <Button variant="primary" className="w-100" onClick={handleNext}>
          Следующий гейт
        </Button>
      </div>
    </div>
  )
}
