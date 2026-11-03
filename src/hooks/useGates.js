import { useSyncExternalStore } from 'react'
import { getGates, subscribe } from '../store/gatesStore'

export function useGates() {
  return useSyncExternalStore(subscribe, getGates, getGates)
}
