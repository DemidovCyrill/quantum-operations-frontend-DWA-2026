import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { GATES_MOCK } from '../mock/gates'
import { useNavigate, useParams } from 'react-router-dom'
import { isAuthenticated } from '../auth'

export default function FeedPage() {
  const { id } = useParams()
  const [currentGateId, setCurrentGateId] = useState(id ? parseInt(id) : GATES_MOCK[0].id)

  const gate = GATES_MOCK.find((g) => g.id === currentGateId) || GATES_MOCK[0]

  const [likedGates, setLikedGates] = useState(() => {
    const saved = localStorage.getItem('quantum_liked_gates')
    return saved ? JSON.parse(saved) : []
  })

  const isAuth = isAuthenticated()

  const isLiked = likedGates.includes(gate.id)

  const handleNext = () => {
    const currentIndex = GATES_MOCK.findIndex((g) => g.id === currentGateId)
    const nextIndex = (currentIndex + 1) % GATES_MOCK.length
    setCurrentGateId(GATES_MOCK[nextIndex].id)
  }

  const handleLike = () => {
    if (!isAuth) {
      alert('Войдите в аккаунт, чтобы ставить лайки')
      return
    }
    setLikedGates((prev) => {
      const newLikes = prev.includes(gate.id)
        ? prev.filter((id) => id !== gate.id)
        : [...prev, gate.id]
      localStorage.setItem('quantum_liked_gates', JSON.stringify(newLikes))
      return newLikes
    })
  }

  const likesCount = gate.likes_count || 0

  return (
    <div className="feed-page">
      <div className="feed-header">
        <h1 className="app-title">{gate.title}</h1>
      </div>

      <div className="feed-container">
        <div className="vibes-container">
          <video
            className="vibes-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={gate.video_url || '/static/video/video.mp4'} type="video/mp4" />
          </video>

          <div className="vibes-side">
            <div className="param-badge">
              <span className="param-label">X</span>
              <span className="param-value">{gate.angle_x}°</span>
            </div>
            <div className="param-badge">
              <span className="param-label">Y</span>
              <span className="param-value">{gate.angle_y}°</span>
            </div>
            <div className="like-badge">
              <span className="like-icon">{isLiked ? '♥' : '♡'}</span>
              <span className="like-count">{likesCount}</span>
            </div>
            <button className="next-btn" onClick={handleNext}>
              ▶
            </button>
            <button className="like-btn" onClick={handleLike} disabled={!isAuth}>
              {isAuth ? (isLiked ? '♥ Убрать лайк' : '♡ Поставить лайк') : '♥ Войти для лайка'}
            </button>
          </div>

          <div className="vibes-bottom">
            <input
              type="checkbox"
              id={`expand-${gate.id}`}
              className="expand-toggle"
            />
            <label htmlFor={`expand-${gate.id}`} className="description-block">
              <strong>{gate.title}</strong>
              <p className="description-text">{gate.summary || ''}</p>
              <span className="more-link">Ещё</span>
              <span className="less-link">Меньше</span>
            </label>
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