import { createSlice } from '@reduxjs/toolkit'

// Единое состояние загрузки: пока идёт AJAX-запрос, поверх страницы
// показывается анимация, блокирующая кнопки пользователя.
const initialState = {
  pending: 0,
  message: '',
  notice: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading(state, action) {
      state.pending += 1
      state.message = action.payload || 'Загрузка…'
    },
    stopLoading(state) {
      state.pending = Math.max(0, state.pending - 1)
      if (state.pending === 0) state.message = ''
    },
    setNotice(state, action) {
      state.notice = action.payload || null
    },
  },
})

export const { startLoading, stopLoading, setNotice } = uiSlice.actions

export const selectIsLoading = (state) => state.ui.pending > 0
export const selectLoadingMessage = (state) => state.ui.message
export const selectNotice = (state) => state.ui.notice

export default uiSlice.reducer
