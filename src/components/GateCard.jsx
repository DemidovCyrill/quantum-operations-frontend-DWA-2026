import { Card } from 'react-bootstrap'
import { DEFAULT_IMAGE } from '../store/gatesStore'

export default function GateCard({ gate, isOwner, onOpen, onDelete }) {
  const handleImageError = (event) => {
    const image = event.currentTarget
    if (image.dataset.fallbackApplied === '1') return
    image.dataset.fallbackApplied = '1'
    image.src = DEFAULT_IMAGE
  }

  return (
    <Card className="card gate-card" onClick={onOpen} role="button" tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <img
        className="cardImage"
        src={gate.image_url || DEFAULT_IMAGE}
        alt={gate.title}
        onError={handleImageError}
      />

      <Card.Body className="card-body">
        <Card.Title className="card-title">{gate.title}</Card.Title>

        <div className="card-author">
          <span className="card-author-label">Автор:</span> {gate.creator_name}
        </div>

        <Card.Text className="card-desc">
          {gate.summary || 'Без описания'}
        </Card.Text>

        <div className="card-meta">
          <span className="card-angle">X: {gate.angle_x}°</span>
          <span className="card-angle">Y: {gate.angle_y}°</span>
          <span className="card-likes">♥ {gate.likes_count}</span>
        </div>

        <button
          type="button"
          className={`delete-btn ${isOwner ? 'delete-btn-owner' : 'delete-btn-guest'}`}
          title={isOwner ? 'Удалить этот гейт' : 'Удалять гейт может только его автор'}
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
