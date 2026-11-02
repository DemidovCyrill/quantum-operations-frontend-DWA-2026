import { useState } from 'react'
import { Button, Form, Col } from 'react-bootstrap'
import GateCard from '../components/GateCard'
import { GATES_MOCK } from '../mock/gates'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, getCurrentUser } from '../auth'
import { deleteGate } from '../mock/gates'

export default function GridPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [angleXMin, setAngleXMin] = useState(0)
  const [angleXMax, setAngleXMax] = useState(180)
  const [angleYMin, setAngleYMin] = useState(0)
  const [angleYMax, setAngleYMax] = useState(180)
  const [deletedGateId, setDeletedGateId] = useState(null)
  const navigate = useNavigate()

  const isAuth = isAuthenticated()
  const currentUser = getCurrentUser()

  const filteredGates = GATES_MOCK.filter((gate) => {
    const matchesSearch = gate.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAngleX = gate.angle_x >= angleXMin && gate.angle_x <= angleXMax
    const matchesAngleY = gate.angle_y >= angleYMin && gate.angle_y <= angleYMax
    return matchesSearch && matchesAngleX && matchesAngleY
  })

  const handleDelete = (gateId) => {
    if (!isAuth) return
    const gate = GATES_MOCK.find(g => g.id === gateId)
    if (!gate) return
    
    const isOwner = gate.creator_id === currentUser.id
    
    if (isOwner) {
      if (confirm('Удалить этот гейт?')) {
        deleteGate(gateId)
        setDeletedGateId(gateId)
      }
    } else {
      alert('Вы не являетесь создателем этого гейта. У вас нет полномочий для удаления.')
    }
  }

  return (
    <div className="page-content">
      <div className="header">
        <h1 className="app-title">Плитка гейтов</h1>
      </div>

      <div className="filter-section">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Поиск по названию</Form.Label>
            <Form.Control
              type="text"
              placeholder="Поиск по названию гейта…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
          <div className="row g-3">
            <Col md={6}>
              <Form.Label>Угол X:</Form.Label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Form.Control
                  type="number"
                  min="0"
                  max="180"
                  value={angleXMin}
                  onChange={(e) => setAngleXMin(parseInt(e.target.value) || 0)}
                />
                <span style={{ fontWeight: '600', color: '#58BBBA' }}>{angleXMin}°</span>
                <span style={{ fontWeight: '600', color: '#58BBBA' }}>{angleXMax}°</span>
                <Form.Control
                  type="number"
                  min="0"
                  max="180"
                  value={angleXMax}
                  onChange={(e) => setAngleXMax(parseInt(e.target.value) || 180)}
                />
              </div>
            </Col>
            <Col md={6}>
              <Form.Label>Угол Y:</Form.Label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Form.Control
                  type="number"
                  min="0"
                  max="180"
                  value={angleYMin}
                  onChange={(e) => setAngleYMin(parseInt(e.target.value) || 0)}
                />
                <span style={{ fontWeight: '600', color: '#58BBBA' }}>{angleYMin}°</span>
                <span style={{ fontWeight: '600', color: '#58BBBA' }}>{angleYMax}°</span>
                <Form.Control
                  type="number"
                  min="0"
                  max="180"
                  value={angleYMax}
                  onChange={(e) => setAngleXMax(parseInt(e.target.value) || 180)}
                />
              </div>
            </Col>
          </div>
          <Button variant="primary" className="mt-3 w-100">
            Применить
          </Button>
        </Form>
      </div>

      <div className="grid">
        {filteredGates.length === 0 ? (
          <div className="empty-msg">Ничего не найдено. Измените фильтр.</div>
        ) : (
          filteredGates.map((gate) => (
            <GateCard key={gate.id} gate={gate} onClick={() => navigate(`/feed/${gate.id}`)} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  )
}