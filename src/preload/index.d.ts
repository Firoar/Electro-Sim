import { ElectronAPI } from '@electron-toolkit/preload'
import { FilesInfo } from '../types/fileTypes'
import { Content, FileData } from 'src/types/filedata'

declare global {
  interface Window {
    electron: ElectronAPI & {
      openDirectory: (path?: string) => Promise<{
        path: string
        content: FilesInfo[]
      }>
      createFile: (path: string) => Promise<void>
      getAllFiles: (path: string) => Promise<{
        path: string
        content: FilesInfo[]
      }>
      createFolder: (
        pathName: string,
        folderName: string
      ) => Promise<{ success: boolean; message: string }>
      createFolderPrompt: () => Promise<string | null>
      getCustomChips: (path: string) => Promise<FilesInfo[]>
      retrieveContentofFile: (
        filePath: string,
        cwd?: string
      ) => Promise<FileData | { error: string }>
      saveChipContents: (path: string, chipContents: Content[]) => Promise<Boolean>
      saveBeforeQuit: () => Promise<void>
      evaluateChip: (
        name: string,
        chips: Content[]
      ) => Promise<{ class: string; inputs: Map<string, boolean> } | { error: string }>
      saveCompileFiles: (
        cwd: string,
        pathOfFile: string,
        classBody: string
      ) => Promise<{ success: boolean; path: string } | { success: boolean; error: string }>
      getOutputsOfChip: (
        filePath: string,
        inputs: Map<string, boolean>
      ) => Promise<{ error: string } | { outputs: Map<string, boolean> }>
      getDetailsofCustomChip: (cwd: string, filePath: string) => Promise<void>
      getChipFromDiffrentPlace: (
        currentPath: string
      ) => Promise<
        { success: true; path: string } | { success: false; error?: string; reason?: string }
      >
    }
    api: unknown
  }
}
