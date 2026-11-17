import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../store/gatesStore'

const VIDEO_EXTENSION = /\.(mp4|webm|ogv|mov|m4v)$/i

// Приводит адрес медиафайла из веб-сервиса к адресу, который отдаёт
// обратный прокси Vite:
//   pauli_x.png                  -> /static/img/pauli_x.png
//   pauli_x.mp4                  -> /static/video/pauli_x.mp4
//   img/pauli_x.png              -> /static/img/pauli_x.png
//   video/pauli_x.mp4            -> /static/video/pauli_x.mp4
//   uploads/xxx.png              -> /static/uploads/xxx.png
//   /quantum-operations/xxx.png  -> /s3/quantum-operations/xxx.png (MinIO)
//   http(s)://...                -> без изменений
export function mediaUrl(url, fallback = DEFAULT_IMAGE) {
  if (!url) return fallback
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/s3/')) return url
  if (url.startsWith('/quantum-operations/')) return `/s3${url}`
  if (url.startsWith('/static/')) return url
  if (url.startsWith('static/')) return `/${url}`
  if (url === 'img/video.mp4') return '/static/video/video.mp4'
  if (url.startsWith('uploads/')) return `/static/${url}`
  if (url.startsWith('img/')) return `/static/${url}`
  if (url.startsWith('video/')) return `/static/${url}`
  if (url.startsWith('/')) return url

  // Голое имя файла из БД: распределяем по папкам img/ или video/.
  if (VIDEO_EXTENSION.test(url)) return `/static/video/${url}`
  return `/static/img/${url}`
}

export function videoUrl(url) {
  return mediaUrl(url, DEFAULT_VIDEO)
}

export { DEFAULT_IMAGE, DEFAULT_VIDEO }
