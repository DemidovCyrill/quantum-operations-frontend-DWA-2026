import { useSyncExternalStore } from 'react'
import { getCurrentUser, subscribe } from '../auth'

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getCurrentUser, () => null)
  return { user, isAuth: Boolean(user) }
}
