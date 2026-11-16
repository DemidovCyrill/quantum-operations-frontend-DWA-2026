import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/authSlice'
import filtersReducer from './slices/filtersSlice'
import gatesReducer from './slices/gatesSlice'
import uiReducer from './slices/uiSlice'

// Redux Toolkit: reducer'ы + middleware (по умолчанию thunk).
// devTools включены — состояние видно в расширении Redux DevTools.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    gates: gatesReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // В action попадают File/FormData при загрузке медиа.
        ignoredActionPaths: ['payload.imageFile', 'payload.videoFile', 'meta.arg.imageFile', 'meta.arg.videoFile'],
      },
    }),
})

export default store
