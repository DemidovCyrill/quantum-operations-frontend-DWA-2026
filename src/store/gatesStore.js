const STORAGE_KEY = 'quantum_gates_v1'

export const DEFAULT_IMAGE = '/DefaultImage.jpg'
export const DEFAULT_VIDEO = '/static/video/video.mp4'

const SEED_GATES = [
  {
    id: 1,
    title: 'Гейт Паули-X',
    summary: 'Отражающий квантовый вентиль, инвертирующий кубит.',
    image_url: '/static/img/pauli_x.png',
    video_url: '/static/video/pauli_x.mp4',
    angle_x: 0,
    angle_y: 0,
    creator_id: 1,
    creator_name: 'Admin',
    likes_count: 0,
  },
  {
    id: 2,
    title: 'Гейт Паули-Y',
    summary: 'Квантовый вентиль с поворотом вокруг оси Y.',
    image_url: '/static/img/pauli_y.png',
    video_url: '/static/video/pauli_y.mp4',
    angle_x: 90,
    angle_y: 0,
    creator_id: 2,
    creator_name: 'user1',
    likes_count: 5,
  },
  {
    id: 3,
    title: 'Гейт Паули-Z',
    summary: 'Квантовый вентиль с изменением фазы.',
    image_url: '/static/img/pauli_z.png',
    video_url: '/static/video/pauli_z.mp4',
    angle_x: 45,
    angle_y: 45,
    creator_id: 1,
    creator_name: 'Admin',
    likes_count: 12,
  },
  {
    id: 4,
    title: 'Квантовый вентиль Хадамарда',
    summary: 'Создаёт суперпозицию состояний.',
    image_url: '/static/img/hadamard.png',
    video_url: '/static/video/hadamard.mp4',
    angle_x: 180,
    angle_y: 90,
    creator_id: 1,
    creator_name: 'Admin',
    likes_count: 8,
  },
  {
    id: 5,
    title: 'Квантовый вентиль Phase S',
    summary: 'Фазовый сдвиг на 90 градусов.',
    image_url: '/static/img/phase_s.png',
    video_url: '/static/video/phase_s.mp4',
    angle_x: 135,
    angle_y: 135,
    creator_id: 2,
    creator_name: 'user1',
    likes_count: 3,
  },
  {
    id: 6,
    title: 'Квантовый вентиль CNOT',
    summary: 'Двукубитовый управляемый NOT.',
    image_url: '/static/img/cnot.png',
    video_url: '/static/video/cnot.mp4',
    angle_x: 0,
    angle_y: 180,
    creator_id: 1,
    creator_name: 'Admin',
    likes_count: 15,
  },
]

function toNumber(value, fallback = 0) {
  const result = Number(value)
  return Number.isFinite(result) ? result : fallback
}

function normalize(gate) {
  return {
    id: toNumber(gate.id, Date.now()),
    title: String(gate.title || 'Без названия'),
    summary: String(gate.summary || ''),
    image_url: gate.image_url || DEFAULT_IMAGE,
    video_url: gate.video_url || DEFAULT_VIDEO,
    angle_x: toNumber(gate.angle_x, 0),
    angle_y: toNumber(gate.angle_y, 0),
    creator_id: toNumber(gate.creator_id, 1),
    creator_name: String(gate.creator_name || 'Admin'),
    likes_count: Math.max(0, toNumber(gate.likes_count, 0)),
    liked_by: Array.isArray(gate.liked_by) ? gate.liked_by.map((id) => toNumber(id, 0)).filter(Boolean) : [],
  }
}

function loadGates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalize)
      }
    }
  } catch {
    // повреждённые данные в localStorage — начинаем с мок-данных
  }
  return SEED_GATES.map(normalize)
}

let gates = loadGates()
const listeners = new Set()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gates))
  } catch {
    // если не влезло в localStorage — приложение продолжает работать в памяти
  }
}

function commit(nextGates) {
  gates = nextGates
  persist()
  listeners.forEach((listener) => listener())
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getGates() {
  return gates
}

export function getGateById(id) {
  return gates.find((gate) => gate.id === Number(id)) || null
}

export function addGate(data) {
  const gate = normalize({ ...data, id: data.id || Date.now() })
  commit([gate, ...gates])
  return gate
}

export function deleteGate(id) {
  const numericId = Number(id)
  if (!gates.some((gate) => gate.id === numericId)) return false
  commit(gates.filter((gate) => gate.id !== numericId))
  return true
}

export function isLikedBy(gate, userId) {
  if (!gate || !userId) return false
  return gate.liked_by.includes(Number(userId))
}

export function toggleLike(gateId, userId) {
  const numericGateId = Number(gateId)
  const numericUserId = Number(userId)
  if (!numericGateId || !numericUserId) return null

  let updated = null
  commit(
    gates.map((gate) => {
      if (gate.id !== numericGateId) return gate

      const alreadyLiked = gate.liked_by.includes(numericUserId)
      updated = {
        ...gate,
        liked_by: alreadyLiked
          ? gate.liked_by.filter((id) => id !== numericUserId)
          : [...gate.liked_by, numericUserId],
        likes_count: Math.max(0, gate.likes_count + (alreadyLiked ? -1 : 1)),
      }
      return updated
    }),
  )

  return updated
}

export function resetGates() {
  commit(SEED_GATES.map(normalize))
}
