import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../store/gatesStore'

const VIDEO_EXTENSION = /\.(mp4|webm|ogv|mov|m4v)$/i
const IMAGE_EXTENSION = /\.(png|jpe?g|webp|gif|avif|bmp|svg)$/i
const PASSTHROUGH = /^(https?:|data:|blob:|\/\/)/i

// Приводит адрес медиафайла к виду, который отдаёт Vite/прокси.
//
// ВАЖНО: data: и blob: адреса возвращаются без изменений — именно так
// хранятся фото и видео, загруженные в демо-режиме (Lab5, localStorage).
// Иначе вместо картинки получается /static/img/data:image/... и фото ломается.
export function mediaUrl(url, fallback = DEFAULT_IMAGE) {
  if (!url || typeof url !== 'string') return fallback

  const value = url.trim()
  if (!value) return fallback

  // Готовые адреса: http(s), data:, blob:, протокол-относительные.
  if (PASSTHROUGH.test(value)) return value

  if (value.startsWith('/s3/')) return value
  if (value.startsWith('/quantum-operations/')) return `/s3${value}`
  if (value.startsWith('/static/')) return value
  if (value.startsWith('static/')) return `/${value}`
  if (value === 'img/video.mp4') return '/static/video/video.mp4'
  if (value.startsWith('uploads/')) return `/static/${value}`
  if (value.startsWith('img/')) return `/static/${value}`
  if (value.startsWith('video/')) return `/static/${value}`
  if (value.startsWith('/')) return value

  // В базе старых лабораторных хранятся «голые» имена файлов:
  //   pauli_x.png -> /static/img/pauli_x.png
  //   pauli_x.mp4 -> /static/video/pauli_x.mp4
  if (VIDEO_EXTENSION.test(value)) return `/static/video/${value}`
  if (IMAGE_EXTENSION.test(value)) return `/static/img/${value}`

  // Неизвестный относительный путь не переписываем.
  return value
}

export function videoUrl(url) {
  return mediaUrl(url, DEFAULT_VIDEO)
}

export { DEFAULT_IMAGE, DEFAULT_VIDEO }
