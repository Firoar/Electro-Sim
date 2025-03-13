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
      retrieveContentofFile: (path: string) => Promise<FileData | { error: string }>
      saveChipContents: (path: string, chipContents: Content[]) => Promise<Boolean>
      saveBeforeQuit: () => Promise<void>
    }
    api: unknown
  }
}
