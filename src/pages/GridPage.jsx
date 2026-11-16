import { useEffect, useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import GateCard from '../components/GateCard'
import { selectIsAuth, selectUser } from '../store/slices/authSlice'
import {
  DEFAULT_FILTERS,
  resetFilters,
  selectFilters,
  setFilters,
} from '../store/slices/filtersSlice'
import { selectGates, selectGatesSource, selectGatesStatus } from '../store/slices/gatesSlice'
import { selectIsLoading } from '../store/slices/uiSlice'
import { deleteGateById, fetchGates, likeGateById } from '../store/thunks/gatesThunks'

export default function GridPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const gates = useSelector(selectGates)
  const filters = useSelector(selectFilters)
  const status = useSelector(selectGatesStatus)
  const source = useSelector(selectGatesSource)
  const loading = useSelector(selectIsLoading)
  const user = useSelector(selectUser)
  const isAuth = useSelector(selectIsAuth)

  const isOwnerOf = (gate) => Boolean(user) && Number(gate.creator_id) === Number(user.id)

  const [form, setForm] = useState({ ...DEFAULT_FILTERS, ...filters })

  useEffect(() => {
    if (status === 'idle') dispatch(fetchGates())
  }, [dispatch, status])

  useEffect(() => {
    setForm({ ...DEFAULT_FILTERS, ...filters })
  }, [filters])

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const applyFilters = () => {
    dispatch(
      setFilters({
        q: form.q.trim(),
        angleXMin: Number(form.angleXMin) || 0,
        angleXMax: Number(form.angleXMax) || 0,
        angleYMin: Number(form.angleYMin) || 0,
        angleYMax: Number(form.angleYMax) || 0,
        sortBy: form.sortBy,
        sortOrder: form.sortOrder,
      }),
    )
    dispatch(fetchGates())
  }

  const resetAll = () => {
    dispatch(resetFilters())
    dispatch(fetchGates())
  }

  const handleDelete = (gate) => {
    if (!isOwnerOf(gate)) {
      if (!isAuth) {
        window.alert(
          `Вы не автор услуги «${gate.title}». Чтобы удалять услуги, войдите под аккаунтом автора (${gate.creator_name}).`,
        )
      } else {
        window.alert(`Вы не являетесь автором услуги «${gate.title}». Удалить её может только ${gate.creator_name}.`)
      }
      return
    }

    if (window.confirm(`Удалить услугу «${gate.title}»? Действие нельзя отменить.`)) {
      dispatch(deleteGateById(gate)).catch(() => {})
    }
  }

  const handleLike = (gate) => {
    if (!isAuth) {
      window.alert('Войдите или зарегистрируйтесь, чтобы ставить лайки.')
      return
    }
    if (isOwnerOf(gate)) {
      window.alert('Нельзя ставить лайк своей услуге.')
      return
    }
    dispatch(likeGateById(gate)).catch(() => {})
  }

  return (
    <div className="page-content">
      <div className="header">
        <h1 className="app-title">Плитка гейтов</h1>
        {source === 'mock' && <div className="source-badge">демо-данные (mock)</div>}
        {source === 'api' && <div className="source-badge source-badge-api">данные веб-сервиса</div>}
      </div>

      <div className="filter-section">
        <Form
          onSubmit={(event) => {
            event.preventDefault()
            applyFilters()
          }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Поиск по названию</Form.Label>
            <Form.Control
              type="text"
              placeholder="Поиск по названию гейта…"
              value={form.q}
              onChange={(event) => updateField('q', event.target.value)}
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
                  value={form.angleXMin}
                  onChange={(event) => updateField('angleXMin', event.target.value)}
                />
                <span className="angle-range-sep">—</span>
                <Form.Control
                  type="number"
                  min="0"
                  max="180"
                  value={form.angleXMax}
                  onChange={(event) => updateField('angleXMax', event.target.value)}
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
                  value={form.angleYMin}
                  onChange={(event) => updateField('angleYMin', event.target.value)}
                />
                <span className="angle-range-sep">—</span>
                <Form.Control
                  type="number"
                  min="0"
                  max="180"
                  value={form.angleYMax}
                  onChange={(event) => updateField('angleYMax', event.target.value)}
                />
              </div>
            </Col>
          </div>

          <Form.Group className="mt-3">
            <Form.Label>Сортировка</Form.Label>
            <Form.Select
              value={`${form.sortBy}:${form.sortOrder}`}
              onChange={(event) => {
                const [sortBy, sortOrder] = event.target.value.split(':')
                setForm((prev) => ({ ...prev, sortBy, sortOrder }))
              }}
            >
              <option value="id:asc">По умолчанию</option>
              <option value="title:asc">По названию (А–Я)</option>
              <option value="title:desc">По названию (Я–А)</option>
              <option value="created_at:desc">Сначала новые</option>
              <option value="created_at:asc">Сначала старые</option>
            </Form.Select>
          </Form.Group>

          <div className="filter-actions">
            <Button variant="outline-primary" type="button" onClick={resetAll} disabled={loading}>
              Сбросить
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              Применить
            </Button>
          </div>
        </Form>
      </div>

      {status === 'failed' && (
        <div className="empty-msg">Не удалось загрузить услуги. Проверьте, запущен ли веб-сервис.</div>
      )}

      <div className="grid">
        {status !== 'failed' && gates.length === 0 && status !== 'loading' ? (
          <div className="empty-msg">Ничего не найдено. Измените условия фильтра.</div>
        ) : (
          gates.map((gate) => (
            <GateCard
              key={gate.id}
              gate={gate}
              isOwner={isOwnerOf(gate)}
              onOpen={() => navigate(`/feed/${gate.id}`)}
              onDetails={() => navigate(`/gates/${gate.id}`)}
              onDelete={handleDelete}
              onLike={handleLike}
            />
          ))
        )}
      </div>
    </div>
  )
}
