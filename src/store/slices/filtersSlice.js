import { createSlice } from '@reduxjs/toolkit'

// Значения фильтров хранятся в Redux Toolkit и передаются в запрос к бэкенду.
export const DEFAULT_FILTERS = {
  q: '',
  angleXMin: 0,
  angleXMax: 180,
  angleYMin: 0,
  angleYMax: 180,
  sortBy: 'id',
  sortOrder: 'asc',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { ...DEFAULT_FILTERS },
  reducers: {
    setFilter(state, action) {
      const { name, value } = action.payload
      if (name in state) state[name] = value
    },
    setFilters(state, action) {
      Object.assign(state, DEFAULT_FILTERS, action.payload)
    },
    resetFilters() {
      return { ...DEFAULT_FILTERS }
    },
  },
})

export const { setFilter, setFilters, resetFilters } = filtersSlice.actions

export const selectFilters = (state) => state.filters

export default filtersSlice.reducer
