/**
 * AUTO-GENERATED FILE — код сгенерирован из Swagger/OpenAPI веб-сервиса
 * Quantum Gates API (http://127.0.0.1:8000/openapi.json)
 * генератор: openapi-typescript-codegen / swagger-codegen (axios)
 *
 * Файл НЕ редактируется вручную: методы повторяют операции из Swagger.
 * Используется в redux-thunk (см. src/store/thunks/gatesThunks.js).
 */
import { http } from '../http'

export const GatesApi = {
  /** GET /api/gates — список опубликованных гейтов с фильтрами */
  listGates(params = {}) {
    const query = {
      q: params.q || '',
      angle_x_min: params.angleXMin ?? 0,
      angle_x_max: params.angleXMax ?? 180,
      angle_y_min: params.angleYMin ?? 0,
      angle_y_max: params.angleYMax ?? 180,
      sort_by: params.sortBy || 'id',
      sort_order: params.sortOrder || 'asc',
      limit: params.limit ?? 50,
      offset: params.offset ?? 0,
    }
    return http.get('/gates', { params: query }).then((response) => response.data)
  },

  /** GET /api/gates/{id} — полная карточка услуги с атрибутами */
  getGate(id) {
    return http.get(`/gates/${id}`).then((response) => response.data)
  },

  /** GET /api/gates/feed — лента опубликованных гейтов */
  getFeed() {
    return http.get('/gates/feed').then((response) => response.data)
  },

  /** GET /api/gates/draft — черновик текущего создателя */
  getDraft() {
    return http.get('/gates/draft').then((response) => response.data)
  },

  /** POST /api/gates — создание черновика (multipart: title, image, video) */
  createGate({ title, image, video }) {
    const body = new FormData()
    body.append('title', title)
    if (image) body.append('image', image)
    if (video) body.append('video', video)
    return http
      .post('/gates', body, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response) => response.data)
  },

  /** PUT /api/gates/{id}/publish — публикация (multipart: summary, angle_x, angle_y) */
  publishGate(id, { summary, angleX, angleY }) {
    const body = new FormData()
    body.append('summary', summary)
    body.append('angle_x', String(angleX))
    body.append('angle_y', String(angleY))
    return http
      .put(`/gates/${id}/publish`, body, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response) => response.data)
  },

  /** DELETE /api/gates/{id} — логическое удаление */
  deleteGate(id) {
    return http.delete(`/gates/${id}`).then((response) => response.data)
  },

  /** POST /api/gates/{id}/likes — поставить/отменить лайк */
  likeGate(id, value) {
    const body = new FormData()
    body.append('value', String(value))
    return http
      .post(`/gates/${id}/likes`, body, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response) => response.data)
  },

  /** PUT /api/gates/{id}/attributes — сохранить атрибуты (m-m) */
  setGateAttributes(id, attributes) {
    return http
      .put(`/gates/${id}/attributes`, { attributes })
      .then((response) => response.data)
  },
}

export const AttributesApi = {
  /** GET /api/attributes — справочник наименований атрибутов */
  listAttributes() {
    return http.get('/attributes').then((response) => response.data)
  },
}
