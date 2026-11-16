import { createSlice } from '@reduxjs/toolkit'

// Состояние интерфейса пользователя.
// ВАЖНО: пользователь хранится только в памяти Redux (как требует ЛР-6):
// после F5 состояние сбрасывается в «гость», а cookie сессии остаётся в браузере.
const initialState = {
  user: null,
  source: null, // 'api' — данные из веб-сервиса, 'mock' — локальная демо-авторизация
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, source } = action.payload
      state.user = user
      state.source = source
      state.error = null
    },
    clearCredentials(state) {
      state.user = null
      state.source = null
      state.error = null
    },
    setAuthError(state, action) {
      state.error = action.payload || null
    },
  },
})

export const { setCredentials, clearCredentials, setAuthError } = authSlice.actions

export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuth = (state) => Boolean(state.auth.user)
export const selectAuthSource = (state) => state.auth.source

export default authSlice.reducer
