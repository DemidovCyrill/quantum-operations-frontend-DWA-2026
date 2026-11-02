import { Card } from 'react-bootstrap'

const DEFAULT_IMAGE = '/static/img/pauli_x.png'
const DEFAULT_VIDEO = '/static/video/video.mp4'

export default function GateCard({ gate, onClick, onDelete }) {
  const isCreator = gate.creator_id === 1 // admin по умолчанию - создатель первого гейта

  return (
    <Card className="card" style={{ width: '180px', margin: '8px', background: '#000000', color: '#eaeaea', cursor: 'pointer' }}
          onClick={onClick}
    >
      <Card.Img
        className="cardImage"
        variant="top"
        src={gate.image_url || DEFAULT_IMAGE}
        height="130px"
        width="100%"
        style={{ objectFit: 'cover', background: '#111' }}
      />
      <Card.Body style={{ padding: '12px' }}>
        <Card.Title style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px', margin: '0' }}>
          {gate.title}
        </Card.Title>
        <Card.Text
          className="card-desc"
          style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px', margin: '0', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {gate.summary || 'Без описания'}
        </Card.Text>
        <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
          <span style={{ fontSize: '12px', color: '#58BBBA', fontWeight: '700' }}>X: {gate.angle_x}°</span>
          <span style={{ fontSize: '12px', color: '#58BBBA', fontWeight: '700' }}>Y: {gate.angle_y}°</span>
        </div>
      </Card.Body>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(gate.id) }}
        className="delete-btn"
        style={{ 
          background: gate.creator_id === 1 ? '#e74c3c' : '#58BBBA',
          color: gate.creator_id === 1 ? '#fff' : '#000',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 12px',
          fontWeight: '700',
          fontSize: '12px',
          cursor: gate.creator_id === 1 ? 'pointer' : 'not-allowed',
          width: '100%',
          marginTop: '8px',
          opacity: gate.creator_id !== 1 ? 0.5 : 1,
        }}
        disabled={gate.creator_id !== 1}
      >
        {gate.creator_id === 1 ? 'Удалить' : 'Не автор'}
      </button>
    </Card>
  )
}