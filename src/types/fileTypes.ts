export type FilesInfo = {
  id: number
  name: string
  isFolder: boolean
  items: FilesInfo[]
  path: string
}
