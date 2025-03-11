import { configureStore } from '@reduxjs/toolkit'
import fileExplorerReducer from './features/fileExplorer/fileExplorerSlice'
import chipSliceReducer from './features/chips/chipSlice'

const store = configureStore({
  reducer: {
    fileExplorer: fileExplorerReducer,
    chips: chipSliceReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
