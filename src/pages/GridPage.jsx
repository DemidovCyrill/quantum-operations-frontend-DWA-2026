import { useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import GateCard from '../components/GateCard'
import { useAuth } from '../hooks/useAuth'
import { useGates } from '../hooks/useGates'
import { deleteGate } from '../store/gatesStore'

export default function GridPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [angleXMin, setAngleXMin] = useState(0)
  const [angleXMax, setAngleXMax] = useState(180)
  const [angleYMin, setAngleYMin] = useState(0)
  const [angleYMax, setAngleYMax] = useState(180)

  const navigate = useNavigate()
  const gates = useGates()
  const { user } = useAuth()

  const filteredGates = gates.filter((gate) => {
    const matchesSearch = gate.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    const matchesAngleX = gate.angle_x >= angleXMin && gate.angle_x <= angleXMax
    const matchesAngleY = gate.angle_y >= angleYMin && gate.angle_y <= angleYMax
    return matchesSearch && matchesAngleX && matchesAngleY
  })

  const handleDelete = (gate) => {
    const isOwner = Boolean(user) && gate.creator_id === user.id

    if (!isOwner) {
      if (!user) {
        window.alert(
          `Вы не автор карточки «${gate.title}». Чтобы удалять гейты, войдите под аккаунтом автора (${gate.creator_name}).`,
        )
      } else {
        window.alert(
          `Вы не являетесь автором карточки «${gate.title}». Удалить её может только ${gate.creator_name}.`,
        )
      }
      return
    }

    if (window.confirm(`Удалить гейт «${gate.title}»? Действие нельзя отменить.`)) {
      deleteGate(gate.id)
    }
  }

  return (
    <div className="page-content">
      <div className="header">
        <h1 className="app-title">Плитка гейтов</h1>
      </div>

      <div className="filter-section">
        <Form onSubmit={(event) => event.preventDefault()}>
          <Form.Group className="mb-3">
            <Form.Label>Поиск по названию</Form.Label>
            <Form.Control
              type="text"
              placeholder="Поиск по названию гейта…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </Form.Group>

          <div className="row g-3">
            <Col xs={6}>
              <Form.Label>Угол X</Form.Label>
              <div className="angle-range">
                <Form.Control
                  type="number"
                  min="0"
                  max="180"
                  value={angleXMin}
                  onChange={(event) => setAngleXMin(Number(event.target.value) || 0)}
                />
                <span className="angle-range-sep">—</span>
                <Form.Control
                  type="number"
                  min="0"
                  max="180"
                  value={angleXMax}
                  onChange={(event) => setAngleXMax(Number(event.target.value) || 0)}
                />
              </div>
            </Col>

            <Col xs={6}>
              <Form.Label>Угол Y</Form.Label>
              <div className="angle-range">
                <Form.Control
                  type="number"
                  min="0"
                  max="180"
                  value={angleYMin}
                  onChange={(event) => setAngleYMin(Number(event.target.value) || 0)}
                />
                <span className="angle-range-sep">—</span>
                <Form.Control
                  type="number"
                  min="0"
                  max="180"
                  value={angleYMax}
                  onChange={(event) => setAngleYMax(Number(event.target.value) || 0)}
                />
              </div>
            </Col>
          </div>

          <Button variant="primary" type="button" className="mt-3 w-100">
            Применить
          </Button>
        </Form>
      </div>

      <div className="grid">
        {filteredGates.length === 0 ? (
          <div className="empty-msg">Ничего не найдено. Измените условия фильтра.</div>
        ) : (
          filteredGates.map((gate) => (
            <GateCard
              key={gate.id}
              gate={gate}
              isOwner={Boolean(user) && gate.creator_id === user.id}
              onOpen={() => navigate(`/feed/${gate.id}`)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
