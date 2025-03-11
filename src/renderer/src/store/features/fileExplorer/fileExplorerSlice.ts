import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { RootState } from '@renderer/store/store'
import { FilesInfo } from 'src/types/fileTypes'

export interface FileExplorer {
  cwd: string
  dirContents: FilesInfo[]
  selectedFolder: string
  selectedFile: string
  selectedContent: string | null
  allSelectedFolders: string[]
  allSelectedFiles: string[]
  clickedFileOption: boolean
  clickedBuiltInChipsOption: boolean
  clickedCustomChipsOption: boolean
}

const initialState: FileExplorer = {
  cwd: '',
  dirContents: [],
  selectedFolder: '',
  selectedFile: '',
  selectedContent: null,
  allSelectedFolders: [],
  allSelectedFiles: [],
  clickedFileOption: false,
  clickedBuiltInChipsOption: false,
  clickedCustomChipsOption: false
}

// export const setSelectedFileThunk = createAsyncThunk(

//   'fileExplorer/setSelectedFileThunk',
//   async (fileName: string,{getState,dispatch}) => {
//     const state = getState() as RootState
//     const chipContents = state.chips.chipContents

//   }

// )

export const fileExplorerSlice = createSlice({
  name: 'fileExplorer',
  initialState,
  reducers: {
    setCwd: (state, action: PayloadAction<string>) => {
      state.cwd = action.payload
    },
    setDirContents: (state, action: PayloadAction<FilesInfo[]>) => {
      state.dirContents = action.payload
    },
    setSelectedFolder: (state, action: PayloadAction<string>) => {
      state.selectedFolder = action.payload
    },
    setSelectedFile: (state, action: PayloadAction<string>) => {
      state.selectedFile = action.payload
      if (!state.allSelectedFiles.includes(action.payload)) {
        state.allSelectedFiles.push(action.payload)
      }
    },

    setAllSelectedFolders: (state, action: PayloadAction<string[]>) => {
      state.allSelectedFolders = action.payload
    },
    setSelectedContent: (state, action: PayloadAction<string | null>) => {
      state.selectedContent = action.payload
    },
    setAllSelectedFiles: (state, action: PayloadAction<string[]>) => {
      state.allSelectedFiles = action.payload
    },
    setClickedOption: (state, action: PayloadAction<'file' | 'builtIn' | 'custom'>) => {
      if (action.payload === 'file') {
        state.clickedFileOption = !state.clickedFileOption
        if (state.clickedFileOption) {
          state.clickedBuiltInChipsOption = false
          state.clickedCustomChipsOption = false
        }
      } else if (action.payload === 'builtIn') {
        state.clickedBuiltInChipsOption = !state.clickedBuiltInChipsOption
        if (state.clickedBuiltInChipsOption) {
          state.clickedFileOption = false
          state.clickedCustomChipsOption = false
        }
      } else if (action.payload === 'custom') {
        state.clickedCustomChipsOption = !state.clickedCustomChipsOption
        if (state.clickedCustomChipsOption) {
          state.clickedFileOption = false
          state.clickedBuiltInChipsOption = false
        }
      }
    }
  }
})

export const {
  setCwd,
  setDirContents,
  setSelectedFile,
  setSelectedFolder,
  setAllSelectedFolders,
  setSelectedContent,
  setAllSelectedFiles,
  setClickedOption
} = fileExplorerSlice.actions
export default fileExplorerSlice.reducer
