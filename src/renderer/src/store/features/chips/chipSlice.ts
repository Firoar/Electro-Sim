import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Content } from 'src/types/filedata'

export interface chips {
  selectedChip: { name: string; loc: string }
  chipContents: Content[]
  currId: number
  dimensions: { width: number; height: number }
  connectionTime: boolean
  wires: Record<string, boolean>
  inputChipBtn: string
  outputChipBtn: string
  // wireMap: Map<string, [number, number, number, number]>
}

const initialState: chips = {
  selectedChip: { name: '', loc: '' },
  chipContents: [],
  currId: 0,
  dimensions: { width: 1800, height: 1200 },
  connectionTime: false,
  wires: {},
  inputChipBtn: '',
  outputChipBtn: ''
  // wireMap: new Map<string, [number, number, number, number]>()
}

export const chipSlice = createSlice({
  name: 'chips',
  initialState,
  reducers: {
    resetStates: (state) => {
      state.connectionTime = initialState.connectionTime
      state.inputChipBtn = initialState.inputChipBtn
      state.outputChipBtn = initialState.outputChipBtn
    },
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
      state.connectionTime = initialState.connectionTime
      state.inputChipBtn = initialState.inputChipBtn
      state.outputChipBtn = initialState.outputChipBtn
    },
    toggleChipStatus: (state, action: PayloadAction<number>) => {
      const id = action.payload
      const chipIndex = state.chipContents.findIndex((ch) => ch.id === id)
      if (chipIndex != -1) {
        const changeTo = state.chipContents[chipIndex].status === 'off' ? 'on' : 'off'
        state.chipContents[chipIndex] = {
          ...state.chipContents[chipIndex],
          status: changeTo
        }
      }
    },
    removeChip: (state, action: PayloadAction<number>) => {
      const chipId = action.payload
      state.chipContents = state.chipContents.filter((chip) => chip.id !== chipId)

      state.wires = Object.fromEntries(
        Object.entries(state.wires).filter(([key]) => {
          const [inChipId, , outChipId] = key.split('-')
          return Number(inChipId) !== chipId && Number(outChipId) !== chipId
        })
      )

      // Remove chip references from inputFrom & outputTo in other chips
      state.chipContents.forEach((chip) => {
        chip.inputFrom = chip.inputFrom.filter((ele) => ele[0] !== chipId)
        chip.outputTo = chip.outputTo.filter((ele) => ele[0] !== chipId)
      })
    },
    toggleConnectionTime: (state) => {
      state.connectionTime = !state.connectionTime
    },
    setInputChipBtn: (state, action: PayloadAction<string>) => {
      state.inputChipBtn = action.payload
    },
    setOutputChipBtn: (state, action: PayloadAction<string>) => {
      state.outputChipBtn = action.payload
    },
    addWire: (state, action: PayloadAction<string>) => {
      state.wires[action.payload] = true

      const [inputChipId, inId, outputChipId, outId] = action.payload.split('-').map(Number)
      const inputChipIndex = state.chipContents.findIndex((ch) => ch.id === inputChipId)
      const outputChipIndex = state.chipContents.findIndex((ch) => ch.id === outputChipId)

      if (inputChipIndex !== -1) {
        const inputChip = state.chipContents[inputChipIndex]

        // Ensure inputFrom array exists
        inputChip.inputFrom ??= []

        // Check if the wire already exists
        const inWireExists = inputChip.inputFrom.some(
          ([outIdChip, outPin, inPin]) =>
            outIdChip === outputChipId && outPin === outId && inPin === inId
        )

        if (!inWireExists) {
          inputChip.inputFrom.push([outputChipId, outId, inId])
        }
      }

      if (outputChipIndex !== -1) {
        const outputChip = state.chipContents[outputChipIndex]

        // Ensure outputTo array exists
        outputChip.outputTo ??= []

        // Check if the wire already exists
        const outWireExists = outputChip.outputTo.some(
          ([inIdChip, inPin, outPin]) =>
            inIdChip === inputChipId && inPin === inId && outPin === outId
        )

        if (!outWireExists) {
          outputChip.outputTo.push([inputChipId, inId, outId])
        }
      }
    },
    addWireToWires: (state, action: PayloadAction<[number, number, number, number][]>) => {
      action.payload.forEach(([inputChipId, inId, outputChipId, outId]) => {
        const key = `${inputChipId}-${inId}-${outputChipId}-${outId}`
        state.wires[key] = true
      })
    },
    removeWire: (state, action: PayloadAction<string>) => {
      delete state.wires[action.payload]
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
  resetContents,
  toggleChipStatus,
  removeChip,
  toggleConnectionTime,
  setInputChipBtn,
  setOutputChipBtn,
  addWire,
  removeWire,
  resetStates,
  addWireToWires
} = chipSlice.actions
export default chipSlice.reducer
