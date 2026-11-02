export const GATES_MOCK = [
  {
    id: 1,
    title: 'Гейт Паули-X',
    summary: 'Отражающий квантовый вентиль, инвертирующий кубит.',
    status: 'published',
    image_url: '/static/img/pauli_x.png',
    video_url: '/static/video/pauli_x.mp4',
    angle_x: 0,
    angle_y: 0,
    creator_id: 1,
    likes_count: 0,
    is_creator: true,
  },
  {
    id: 2,
    title: 'Гейт Паули-Y',
    summary: 'Квантовый вентиль с поворотом вокруг оси Y.',
    status: 'published',
    image_url: '/static/img/pauli_y.png',
    video_url: '/static/video/pauli_y.mp4',
    angle_x: 90,
    angle_y: 0,
    creator_id: 2,
    likes_count: 5,
    is_creator: false,
  },
  {
    id: 3,
    title: 'Гейт Паули-Z',
    summary: 'Квантовый вентиль с изменением фазы.',
    status: 'published',
    image_url: '/static/img/pauli_z.png',
    video_url: '/static/video/pauli_z.mp4',
    angle_x: 45,
    angle_y: 45,
    creator_id: 1,
    likes_count: 12,
    is_creator: true,
  },
  {
    id: 4,
    title: 'Квантовый вентиль Хадамарда',
    summary: 'Создает суперпозицию состояний.',
    status: 'published',
    image_url: '/static/img/hadamard.png',
    video_url: '/static/video/hadamard.mp4',
    angle_x: 180,
    angle_y: 90,
    creator_id: 3,
    likes_count: 8,
    is_creator: false,
  },
  {
    id: 5,
    title: 'Квантовый вентиль Phase S',
    summary: 'Фазовый сдвиг на 90 градусов.',
    status: 'published',
    image_url: '/static/img/phase_s.png',
    video_url: '/static/video/phase_s.mp4',
    angle_x: 135,
    angle_y: 135,
    creator_id: 2,
    likes_count: 3,
    is_creator: false,
  },
  {
    id: 6,
    title: 'Квантовый вентиль CNOT',
    summary: 'Двукубитовый управляемый NOT.',
    status: 'published',
    image_url: '/static/img/cnot.png',
    video_url: '/static/video/cnot.mp4',
    angle_x: 0,
    angle_y: 180,
    creator_id: 3,
    likes_count: 15,
    is_creator: false,
  },
]

export function addGate(gate) {
  GATES_MOCK.push(gate)
  return gate
}

export function deleteGate(id) {
  const index = GATES_MOCK.findIndex(g => g.id === id)
  if (index !== -1) {
    GATES_MOCK.splice(index, 1)
    return true
  }
  return false
}

export function getGateById(id) {
  return GATES_MOCK.find(g => g.id === id)
}

export function updateGateLikes(gateId, isLiked) {
  const gate = GATES_MOCK.find(g => g.id === gateId)
  if (gate) {
    if (isLiked) {
      gate.likes_count += 1
    } else {
      gate.likes_count = Math.max(0, gate.likes_count - 1)
    }
  }
}