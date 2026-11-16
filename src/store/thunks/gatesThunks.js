import { createAsyncThunk } from '@reduxjs/toolkit'

import { GatesApi } from '../../api/generated/quantumGatesApi'
import { describeApiError, isNetworkError } from '../../api/http'
import { gateFromApi, gateFromMock } from '../../api/mappers'
import { addGate, deleteGate, getGates, toggleLike } from '../gatesStore'
import { setSelectedGate, setGates, setGatesError, setGatesStatus, updateGate, removeGate, appendGate } from '../slices/gatesSlice'
import { setNotice, startLoading, stopLoading } from '../slices/uiSlice'

// Мок-коллекция доступна только гостю (или при недоступном бэкенде),
// как требует задание ЛР-6.
function mockGateList(user) {
  return getGates().map((gate) => gateFromMock(gate, user))
}

function canUseMock(state) {
  return !state.auth.user || state.auth.source === 'mock'
}

export const fetchGates = createAsyncThunk('gates/fetchGates', async (_arg, { getState, dispatch }) => {
  const state = getState()
  const filters = state.filters
  const user = state.auth.user

  dispatch(setGatesStatus('loading'))
  dispatch(startLoading('Загружаем услуги…'))

  try {
    const response = await GatesApi.listGates(filters)
    const items = (response.items || response.data || []).map(gateFromApi)
    dispatch(setGates({ items, source: 'api' }))
    dispatch(setNotice(null))
    return items
  } catch (error) {
    if (isNetworkError(error) && canUseMock(state)) {
      const items = mockGateList(user)
      dispatch(setGates({ items, source: 'mock' }))
      dispatch(
        setNotice({
          type: 'warning',
          text: 'Веб-сервис недоступен — показаны демонстрационные данные (гостевой режим).',
        }),
      )
      return items
    }
    dispatch(setGatesError(describeApiError(error)))
    throw error
  } finally {
    dispatch(stopLoading())
  }
})

export const fetchGateById = createAsyncThunk('gates/fetchGateById', async (id, { getState, dispatch }) => {
  const state = getState()
  const cached = state.gates.items.find((gate) => gate.id === Number(id))
  if (cached) {
    dispatch(setSelectedGate(cached))
    return cached
  }

  dispatch(startLoading('Загружаем карточку…'))
  try {
    const data = await GatesApi.getGate(id)
    const gate = gateFromApi(data)
    dispatch(setSelectedGate(gate))
    return gate
  } catch (error) {
    if (isNetworkError(error) && canUseMock(state)) {
      const gate = mockGateList(state.auth.user).find((item) => item.id === Number(id)) || null
      dispatch(setSelectedGate(gate))
      return gate
    }
    throw error
  } finally {
    dispatch(stopLoading())
  }
})

export const createGate = createAsyncThunk('gates/createGate', async (payload, { getState, dispatch }) => {
  const state = getState()
  const user = state.auth.user
  if (!user) throw new Error('Требуется авторизация')

  dispatch(startLoading('Публикуем услугу…'))
  try {
    let gate

    if (state.auth.source === 'mock') {
      // Офлайн-демо: сохраняем в локальную коллекцию mock-объектов.
      const saved = addGate({
        title: payload.title,
        summary: payload.summary,
        image_url: payload.imageUrl,
        video_url: payload.videoUrl,
        angle_x: payload.angleX,
        angle_y: payload.angleY,
        creator_id: user.id,
        creator_name: user.username,
        attributes: payload.attributes || [],
      })
      gate = gateFromMock(saved, user)
    } else {
      const draft = await GatesApi.createGate({
        title: payload.title,
        image: payload.imageFile,
        video: payload.videoFile,
      })
      const published = await GatesApi.publishGate(draft.id, {
        summary: payload.summary,
        angleX: payload.angleX,
        angleY: payload.angleY,
      })
      gate = gateFromApi({ ...published, is_creator: true })
      if (payload.attributes?.length) {
        const saved = await GatesApi.setGateAttributes(published.id, payload.attributes)
        gate = gateFromApi({ ...(saved || published), is_creator: true })
      }
    }

    dispatch(appendGate(gate))
    return gate
  } catch (error) {
    dispatch(setNotice({ type: 'danger', text: describeApiError(error) }))
    throw error
  } finally {
    dispatch(stopLoading())
  }
})

export const deleteGateById = createAsyncThunk('gates/deleteGate', async (gate, { getState, dispatch }) => {
  const state = getState()
  dispatch(startLoading('Удаляем услугу…'))
  try {
    if (state.gates.source === 'mock' || state.auth.source === 'mock') {
      deleteGate(gate.id)
    } else {
      await GatesApi.deleteGate(gate.id)
    }
    dispatch(removeGate(gate.id))
    dispatch(setNotice({ type: 'success', text: `Услуга «${gate.title}» удалена.` }))
    return gate.id
  } catch (error) {
    dispatch(setNotice({ type: 'danger', text: describeApiError(error) }))
    throw error
  } finally {
    dispatch(stopLoading())
  }
})

export const likeGateById = createAsyncThunk('gates/likeGate', async (gate, { getState, dispatch }) => {
  const state = getState()
  const user = state.auth.user
  if (!user) throw new Error('Требуется авторизация')

  const nextValue = gate.is_liked ? 0 : 1

  dispatch(startLoading(gate.is_liked ? 'Убираем лайк…' : 'Ставим лайк…'))
  try {
    if (state.gates.source === 'mock' || state.auth.source === 'mock') {
      toggleLike(gate.id, user.id)
      const updated = mockGateList(user).find((item) => item.id === gate.id)
      dispatch(updateGate(updated))
      return updated
    }

    const response = await GatesApi.likeGate(gate.id, nextValue)
    const updated = {
      ...gate,
      is_liked: Boolean(response.is_liked),
      likes_count: Number(response.likes_count) || 0,
    }
    dispatch(updateGate(updated))
    return updated
  } catch (error) {
    dispatch(setNotice({ type: 'danger', text: describeApiError(error) }))
    throw error
  } finally {
    dispatch(stopLoading())
  }
})
