import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectIsLoading, selectLoadingMessage, selectNotice, setNotice } from '../store/slices/uiSlice'

// Анимация загрузки, блокирующая кнопки пользователя на время AJAX-запроса.
export default function LoadingOverlay() {
  const loading = useSelector(selectIsLoading)
  const message = useSelector(selectLoadingMessage)

  if (!loading) return null

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-box">
        <span className="loading-spinner" aria-hidden="true" />
        <span className="loading-text">{message || 'Загрузка…'}</span>
      </div>
    </div>
  )
}

// Всплывающее уведомление об успехе/ошибке (в т.ч. о переходе на mock-данные).
export function Notice() {
  const notice = useSelector(selectNotice)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => dispatch(setNotice(null)), 6000)
    return () => window.clearTimeout(timer)
  }, [notice, dispatch])

  if (!notice) return null

  return (
    <div className={`app-notice app-notice-${notice.type || 'info'}`} role="alert">
      <span>{notice.text}</span>
      <button type="button" className="app-notice-close" onClick={() => dispatch(setNotice(null))}>
        ×
      </button>
    </div>
  )
}
