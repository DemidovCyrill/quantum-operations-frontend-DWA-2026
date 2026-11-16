import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { DEFAULT_IMAGE, mediaUrl } from '../api/media'
import { selectIsAuth, selectUser } from '../store/slices/authSlice'
import { selectGates, selectSelectedGate } from '../store/slices/gatesSlice'
import { selectIsLoading } from '../store/slices/uiSlice'
import { fetchGateById, likeGateById } from '../store/thunks/gatesThunks'

export default function GateDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const gates = useSelector(selectGates)
  const selected = useSelector(selectSelectedGate)
  const isAuth = useSelector(selectIsAuth)
  const user = useSelector(selectUser)
  const loading = useSelector(selectIsLoading)

  const gate =
    gates.find((item) => item.id === Number(id)) ||
    (selected && selected.id === Number(id) ? selected : null)

  useEffect(() => {
    if (!gate || gate.id !== Number(id)) dispatch(fetchGateById(id)).catch(() => {})
  }, [dispatch, id, gate])

  if (!gate) {
    return (
      <div className="page-content">
        <div className="empty-msg">
          <p>{loading ? 'Загружаем карточку…' : 'Услуга не найдена.'}</p>
          <Button variant="outline-primary" onClick={() => navigate('/')}>
            Назад к плитке
          </Button>
        </div>
      </div>
    )
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
    <div className="page-content details-page">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="details-card">
        <img
          className="details-image"
          src={mediaUrl(gate.image_url, DEFAULT_IMAGE)}
          alt={gate.title}
          onError={(event) => {
            event.currentTarget.src = DEFAULT_IMAGE
          }}
        />

        <h1 className="app-title details-title">{gate.title}</h1>

        <div className="details-meta">
          <span>
            <b>Автор:</b> {gate.creator_name}
          </span>
          <span>
            <b>X:</b> {gate.angle_x}°
          </span>
          <span>
            <b>Y:</b> {gate.angle_y}°
          </span>
          <span>
            <b>Статус:</b> {gate.status === 'published' ? 'опубликован' : gate.status}
          </span>
        </div>

        <div className="details-like-row">
          <button
            type="button"
            className={`like-btn ${gate.is_liked ? 'is-liked' : ''}`}
            onClick={handleLike}
            aria-pressed={Boolean(gate.is_liked)}
          >
            <span className="like-btn-icon">{gate.is_liked ? '♥' : '♡'}</span>
            <span className="like-btn-count">{gate.likes_count}</span>
          </button>
        </div>

        <h2 className="details-subtitle">Описание</h2>
        <p className="details-description">{gate.summary || 'Описание не указано.'}</p>

        <h2 className="details-subtitle">Характеристики услуги</h2>
        {gate.attributes?.length ? (
          <dl className="attr-list">
            {gate.attributes.map((attribute) => (
              <div className="attr-row" key={`${attribute.id}-${attribute.name}`}>
                <dt className="attr-name">{attribute.name}</dt>
                <dd className="attr-value">{attribute.value || '—'}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="details-description details-muted">Характеристики для этой услуги не заданы.</p>
        )}
      </div>
    </div>
  )
}
