import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Content } from 'src/types/filedata'

export interface chips {
  selectedChip: { name: string; loc: string }
  chipContents: Content[]
  currId: number
  dimensions: { width: number; height: number }
}

const initialState: chips = {
  selectedChip: { name: '', loc: '' },
  chipContents: [],
  currId: 0,
  dimensions: { width: 1800, height: 1200 }
}

export const chipSlice = createSlice({
  name: 'chips',
  initialState,
  reducers: {
    setSelectedChip: (state, action: PayloadAction<{ name: string; loc: string }>) => {
      state.selectedChip = action.payload
    },
    setChipContents: (state, action: PayloadAction<Content[]>) => {
      state.chipContents = action.payload
    },
    pushToChipContents: (state, action: PayloadAction<Content>) => {
      state.chipContents.push(action.payload)
      state.currId += 1
    },
    setCurrId: (state, action: PayloadAction<number>) => {
      state.currId = action.payload
    },
    setDimensions: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload
      let { width, height } = state.dimensions

      if (x + 200 >= width) {
        width += 220
      }
      if (y + 200 >= height) {
        height += 220
      }

      state.dimensions = { width, height }
    },
    updateChipPosition: (state, action: PayloadAction<{ id: number; x: number; y: number }>) => {
      const { id, x, y } = action.payload
      const chipIndex = state.chipContents.findIndex((ch) => ch.id === id)

      if (chipIndex !== -1) {
        state.chipContents[chipIndex] = {
          ...state.chipContents[chipIndex],
          position: { x, y }
        }
      }
    },
    resetContents: (state) => {
      state.chipContents = initialState.chipContents
      state.currId = initialState.currId
    }
  }
})

export const {
  setSelectedChip,
  setChipContents,
  setCurrId,
  setDimensions,
  pushToChipContents,
  updateChipPosition,
  resetContents
} = chipSlice.actions
export default chipSlice.reducer
