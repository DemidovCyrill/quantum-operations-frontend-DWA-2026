import { Card } from 'react-bootstrap'

const DEFAULT_IMAGE = '/DefaultImage.jpg'
const DEFAULT_VIDEO = '/video.mp4'

export default function GateCard({ gate }) {
  return (
    <Card className="card" style={{ width: '180px', margin: '8px', background: '#000000', color: '#eaeaea' }}>
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
    </Card>
  )
}