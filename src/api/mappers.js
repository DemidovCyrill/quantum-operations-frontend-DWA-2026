import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../store/gatesStore'

// Приводит ответ веб-сервиса к единой модели карточки.
export function gateFromApi(gate) {
  if (!gate) return null
  return {
    id: Number(gate.id),
    title: gate.title || 'Без названия',
    summary: gate.summary || '',
    status: gate.status || 'published',
    image_url: gate.image_url || DEFAULT_IMAGE,
    video_url: gate.video_url || DEFAULT_VIDEO,
    angle_x: Number(gate.angle_x) || 0,
    angle_y: Number(gate.angle_y) || 0,
    creator_id: Number(gate.creator_id) || 0,
    creator_name: gate.creator_name || (gate.creator_id ? `Автор #${gate.creator_id}` : 'Неизвестный автор'),
    is_creator: Boolean(gate.is_creator),
    likes_count: Number(gate.likes_count) || 0,
    is_liked: Boolean(gate.is_liked),
    attributes: Array.isArray(gate.attributes)
      ? gate.attributes.map((item, index) => ({
          id: Number(item.id) || index + 1,
          name: String(item.name || ''),
          value: String(item.value ?? ''),
        }))
      : [],
  }
}

// Приводит mock-объект (localStorage) к той же модели и добавляет
// признаки текущего пользователя (is_creator / is_liked).
export function gateFromMock(gate, user) {
  if (!gate) return null
  const userId = user?.id ? Number(user.id) : null
  const likedBy = Array.isArray(gate.liked_by) ? gate.liked_by.map(Number) : []
  return {
    id: Number(gate.id),
    title: gate.title || 'Без названия',
    summary: gate.summary || '',
    status: gate.status || 'published',
    image_url: gate.image_url || DEFAULT_IMAGE,
    video_url: gate.video_url || DEFAULT_VIDEO,
    angle_x: Number(gate.angle_x) || 0,
    angle_y: Number(gate.angle_y) || 0,
    creator_id: Number(gate.creator_id) || 0,
    creator_name: gate.creator_name || 'Неизвестный автор',
    is_creator: Boolean(userId) && Number(gate.creator_id) === userId,
    likes_count: Number(gate.likes_count) || 0,
    is_liked: Boolean(userId) && likedBy.includes(userId),
    attributes: Array.isArray(gate.attributes) ? gate.attributes : [],
  }
}
