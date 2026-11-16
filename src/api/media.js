import { DEFAULT_IMAGE, DEFAULT_VIDEO } from '../store/gatesStore'

// Приводит адрес медиафайла из веб-сервиса к адресу, который отдаёт
// обратный прокси Vite:
//   img/pauli_x.png              -> /static/img/pauli_x.png
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
  if (url.startsWith('uploads/')) return `/static/${url}`
  if (url.startsWith('/')) return url
  return `/static/${url}`
}

export function videoUrl(url) {
  return mediaUrl(url, DEFAULT_VIDEO)
}

export { DEFAULT_IMAGE, DEFAULT_VIDEO }
