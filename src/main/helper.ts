import { readdir, stat } from 'fs/promises'
import fs from 'fs'
import { join } from 'path'
import { FilesInfo } from '../types/fileTypes'
import { Content } from '../types/filedata'

export const allContents = async (path: string): Promise<FilesInfo[]> => {
  const filesInfo: FilesInfo[] = []

  try {
    const files = await readdir(path)

    for (let i = 0; i < files.length; i++) {
      const filePath = join(path, files[i])

      let fileStat
      try {
        fileStat = await stat(filePath)
      } catch (err) {
        console.error(`Error reading file stats for ${filePath}:`, err)
        continue
      }

      if (fileStat.isSymbolicLink()) {
        console.warn(`Skipping symbolic link: ${filePath}`)
        continue
      }

      const data: FilesInfo = {
        id: i,
        name: files[i],
        isFolder: fileStat.isDirectory(),
        items: [],
        path: filePath
      }

      // If it's a folder, get its contents recursively
      if (data.isFolder) {
        data.items = await allContents(filePath)
      }

      filesInfo.push(data)
    }
  } catch (error) {
    console.error('Error reading directory:', error)
  }

  return filesInfo
}
export const writeChipFileContents = (
  file: string,
  path: string,
  content: Content[] = [],
  inputIds: number[] = [],
  outputIds: number[] = [],
  compiled: boolean = false
) => {
  return JSON.stringify(
    {
      name: file,
      location: path,
      content: content,
      inputIds: inputIds,
      outputIds: outputIds,
      compiled: compiled
    },
    null,
    2
  )
}

export const isCompiled = async (path: string): Promise<boolean> => {
  const content = fs.readFileSync(path, 'utf-8')
  const data = JSON.parse(content)
  return data.compiled
}

export const saveToFile = async (path: string, chipContents: Content[]) => {
  try {
    if (!fs.existsSync(path)) {
      throw new Error(`File not found: ${path}`)
    }

    const content = fs.readFileSync(path, 'utf-8')

    let data
    try {
      data = JSON.parse(content)
    } catch (error) {
      throw new Error(`Invalid JSON format in file: ${path}`)
    }

    data.content = chipContents

    fs.writeFileSync(path, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving to file:', error)
  }
}
