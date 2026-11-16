import { Card } from 'react-bootstrap'

import { DEFAULT_IMAGE, mediaUrl } from '../api/media'

export default function GateCard({ gate, isOwner, onOpen, onDelete, onLike, onDetails }) {
  const handleImageError = (event) => {
    const image = event.currentTarget
    if (image.dataset.fallbackApplied === '1') return
    image.dataset.fallbackApplied = '1'
    image.src = DEFAULT_IMAGE
  }

  return (
    <Card
      className="card gate-card"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <img className="cardImage" src={mediaUrl(gate.image_url, DEFAULT_IMAGE)} alt={gate.title} onError={handleImageError} />

      <Card.Body className="card-body">
        <Card.Title className="card-title">{gate.title}</Card.Title>

        <div className="card-author">
          <span className="card-author-label">Автор:</span> {gate.creator_name}
        </div>

        <Card.Text className="card-desc">{gate.summary || 'Без описания'}</Card.Text>

        <div className="card-meta">
          <span className="card-angle">X: {gate.angle_x}°</span>
          <span className="card-angle">Y: {gate.angle_y}°</span>

          <button
            type="button"
            className={`card-like ${gate.is_liked ? 'is-liked' : ''}`}
            title={isOwner ? 'Нельзя лайкнуть свою услугу' : gate.is_liked ? 'Убрать лайк' : 'Поставить лайк'}
            aria-pressed={Boolean(gate.is_liked)}
            onClick={(event) => {
              event.stopPropagation()
              onLike(gate)
            }}
          >
            <span aria-hidden="true">{gate.is_liked ? '♥' : '♡'}</span> {gate.likes_count}
          </button>
        </div>

        <button
          type="button"
          className="details-link"
          onClick={(event) => {
            event.stopPropagation()
            onDetails(gate)
          }}
        >
          Подробнее об услуге →
        </button>

        <button
          type="button"
          className={`delete-btn ${isOwner ? 'delete-btn-owner' : 'delete-btn-guest'}`}
          title={isOwner ? 'Удалить эту услугу' : 'Удалять услугу может только её автор'}
          onClick={(event) => {
            event.stopPropagation()
            onDelete(gate)
          }}
        >
          Удалить
        </button>
      </Card.Body>
    </Card>
  )
}
