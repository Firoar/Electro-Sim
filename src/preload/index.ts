import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Content } from '../types/filedata'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)

    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      openDirectory: async (path?: string) => {
        const DirInfo = await ipcRenderer.invoke('dialog:openDirectory', path)
        return DirInfo
      },
      createFile: async (path: string) => {
        await ipcRenderer.invoke('dialog:showSaveDialog', path)
      },
      getAllFiles: async (path: string) => {
        const DirInfo = await ipcRenderer.invoke('dialog:getAllFiles', path)
        return DirInfo
      },
      createFolder: async (pathName: string, folderName: string) => {
        const result = await ipcRenderer.invoke('dialog:createFolder', pathName, folderName)
        return result
      },
      createFolderPrompt: async () => {
        const result = await ipcRenderer.invoke('show-prompt')
        return result
      },
      getCustomChips: async (path: string) => {
        const result = await ipcRenderer.invoke('getCustomChips', path)
        return result
      },
      retrieveContentofFile: async (filePath: string, cwd?: string) => {
        if (cwd) {
          const result = await ipcRenderer.invoke('retrieveContentofFile', filePath, cwd)
          return result
        }
        const result = await ipcRenderer.invoke('retrieveContentofFile', filePath, '')
        return result
      },
      saveChipContents: async (path: string, chipContents: Content[]) => {
        const result = await ipcRenderer.invoke('saveChipContents', path, chipContents)
        return result
      },
      saveBeforeQuit: async () => {
        await ipcRenderer.invoke('saved')
      },
      evaluateChip: async (name: string, chips: Content[]) => {
        const result = await ipcRenderer.invoke('evaluateChip', name, chips)
        return result
      },
      saveCompileFiles: async (cwd: string, pathOfFile: string, classBody: string) => {
        const result = await ipcRenderer.invoke('saveCompileFiles', cwd, pathOfFile, classBody)
        return result
      },
      getOutputsOfChip: async (filePath: string, inputs: Map<number, boolean>) => {
        const result = await ipcRenderer.invoke('getOutputsOfChip', filePath, inputs)
        return result
      },
      getDetailsofCustomChip: async (cwd: string, filePath: string) => {
        await ipcRenderer.invoke('getDetailsofCustomChip', cwd, filePath)
      },
      getChipFromDiffrentPlace: async (currentPath: string) => {
        const result = await ipcRenderer.invoke('getChipFromDiffrentPlace', currentPath)
        return result
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
