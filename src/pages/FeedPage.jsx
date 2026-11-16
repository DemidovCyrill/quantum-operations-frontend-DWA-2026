import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { DEFAULT_VIDEO, mediaUrl, videoUrl } from '../api/media'
import { selectIsAuth, selectUser } from '../store/slices/authSlice'
import { selectGates, selectGatesSource } from '../store/slices/gatesSlice'
import { selectIsLoading } from '../store/slices/uiSlice'
import { fetchGates, likeGateById } from '../store/thunks/gatesThunks'

function GateVideo({ gate }) {
  const videoRef = useRef(null)
  const [src, setSrc] = useState(() => videoUrl(gate.video_url))

  // Новый <video> создаётся заново (key по id услуги), поэтому браузер
  // гарантированно загружает файл нового гейта, а не оставляет старый кадр.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.load()
    const promise = video.play()
    if (promise && typeof promise.catch === 'function') promise.catch(() => {})
  }, [src, gate.id])

  return (
    <video
      ref={videoRef}
      className="vibes-video"
      src={src}
      poster={mediaUrl(gate.image_url)}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onError={() => {
        if (src !== DEFAULT_VIDEO) setSrc(DEFAULT_VIDEO)
      }}
    />
  )
}

export default function FeedPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const gates = useSelector(selectGates)
  const source = useSelector(selectGatesSource)
  const user = useSelector(selectUser)
  const isAuth = useSelector(selectIsAuth)
  const loading = useSelector(selectIsLoading)

  useEffect(() => {
    if (!gates.length) dispatch(fetchGates())
  }, [dispatch, gates.length])

  const routeIndex = gates.findIndex((gate) => gate.id === Number(id))
  const index = routeIndex >= 0 ? routeIndex : 0
  const gate = gates[index] || null

  // Держим адрес страницы в соответствии с открытым гейтом.
  useEffect(() => {
    if (!gate) return
    if (id !== String(gate.id)) navigate(`/feed/${gate.id}`, { replace: true })
  }, [gate, id, navigate])

  if (!gate) {
    return (
      <div className="feed-page">
        <div className="empty-msg">
          <p>{loading ? 'Загружаем ленту…' : 'Гейтов пока нет.'}</p>
          <Button variant="primary" onClick={() => navigate('/add')}>
            Добавить гейт
          </Button>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (gates.length < 2) return
    const nextIndex = (index + 1) % gates.length
    navigate(`/feed/${gates[nextIndex].id}`)
  }

  const handleLike = () => {
    if (!isAuth) {
      window.alert('Войдите или зарегистрируйтесь, чтобы ставить лайки.')
      return
    }
    if (Number(gate.creator_id) === Number(user.id)) {
      window.alert('Нельзя ставить лайк своей услуге.')
      return
    }
    dispatch(likeGateById(gate)).catch(() => {})
  }

  return (
    <div className="feed-page">
      <div className="feed-header">
        <h1 className="app-title">{gate.title}</h1>
        {source === 'mock' && <div className="source-badge">демо-данные (mock)</div>}
      </div>

      <div className="feed-container">
        <div className="vibes-container">
          <GateVideo key={gate.id} gate={gate} />

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
              className={`like-btn ${gate.is_liked ? 'is-liked' : ''}`}
              onClick={handleLike}
              title={user ? (gate.is_liked ? 'Убрать лайк' : 'Поставить лайк') : 'Войдите, чтобы поставить лайк'}
              aria-pressed={Boolean(gate.is_liked)}
            >
              <span className="like-btn-icon">{gate.is_liked ? '♥' : '♡'}</span>
              <span className="like-btn-count">{gate.likes_count}</span>
            </button>

            <button type="button" className="next-btn" onClick={handleNext} title="Следующий гейт" disabled={gates.length < 2}>
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
            <button type="button" className="details-link details-link-light" onClick={() => navigate(`/gates/${gate.id}`)}>
              Подробнее об услуге →
            </button>
          </div>
        </div>
      </div>

      <div className="feed-actions">
        <Button variant="primary" className="w-100" onClick={handleNext} disabled={gates.length < 2}>
          Следующий гейт
        </Button>
      </div>
    </div>
  )
}
