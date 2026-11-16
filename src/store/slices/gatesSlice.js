import { createSlice } from '@reduxjs/toolkit'

// Список услуг (квантовых гейтов). Источник данных:
//   'api'  — веб-сервис FastAPI;
//   'mock' — локальная коллекция mock-объектов (гость без доступа к бэкенду).
const initialState = {
  items: [],
  selected: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  source: null,
  currentId: null,
}

const gatesSlice = createSlice({
  name: 'gates',
  initialState,
  reducers: {
    setGates(state, action) {
      const { items, source } = action.payload
      state.items = items
      state.source = source
      state.status = 'succeeded'
      state.error = null
      if (!items.some((gate) => gate.id === state.currentId)) {
        state.currentId = items[0]?.id ?? null
      }
    },
    appendGate(state, action) {
      state.items = [action.payload, ...state.items]
      state.currentId = action.payload.id
    },
    removeGate(state, action) {
      state.items = state.items.filter((gate) => gate.id !== action.payload)
      if (state.currentId === action.payload) {
        state.currentId = state.items[0]?.id ?? null
      }
    },
    updateGate(state, action) {
      const updated = action.payload
      state.items = state.items.map((gate) => (gate.id === updated.id ? { ...gate, ...updated } : gate))
    },
    setCurrentId(state, action) {
      state.currentId = action.payload
    },
    setSelectedGate(state, action) {
      state.selected = action.payload
    },
    setGatesStatus(state, action) {
      state.status = action.payload
    },
    setGatesError(state, action) {
      state.error = action.payload
      state.status = 'failed'
    },
    resetGates() {
      return { ...initialState }
    },
  },
})

export const {
  setGates,
  appendGate,
  removeGate,
  updateGate,
  setCurrentId,
  setSelectedGate,
  setGatesStatus,
  setGatesError,
  resetGates,
} = gatesSlice.actions

export const selectGates = (state) => state.gates.items
export const selectGatesSource = (state) => state.gates.source
export const selectGatesStatus = (state) => state.gates.status
export const selectGatesError = (state) => state.gates.error
export const selectCurrentId = (state) => state.gates.currentId
export const selectSelectedGate = (state) => state.gates.selected
export const selectGateById = (id) => (state) =>
  state.gates.items.find((gate) => gate.id === Number(id)) || null

export default gatesSlice.reducer
