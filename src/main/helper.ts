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

export const evaluateChip = (name: string, chips: Content[]) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid chip name provided')
  }

  const bulbs = new Map<number, Content>()
  const switches = new Map<number, Content>()
  const gates = new Map<number, Content>()
  const allGates: Content[] = []
  const allBulbs: Content[] = []

  // Categorizing chips into bulbs, switches, and gates
  chips.forEach((chip) => {
    if (chip.inputFrom.length === chip.inputs) {
      if (chip.name === 'bulb') {
        bulbs.set(chip.id, chip)
        allBulbs.push(chip)
      } else if (chip.name === 'switch') {
        if (chip.outputTo.length >= chip.outputs) switches.set(chip.id, chip)
      } else {
        gates.set(chip.id, chip)
        allGates.push(chip)
      }
    }
  })

  const switchDependentGates = new Map<number, Content>()
  const independentGates = new Map<number, Content>()
  const dependencies = new Map<number, number[]>()
  const inDegree = new Map<number, number>() // Keeps track of incoming edges count

  // Classifying gates and building dependencies
  allGates.forEach((gate) => {
    if (gate.inputFrom.length !== gate.inputs) {
      throw new Error(`Gate ${gate.id} has incorrect number of inputs`)
    }

    // If all inputs come from switches, it's directly dependent on switches
    if (gate.inputFrom.every(([sourceId]) => switches.has(sourceId))) {
      switchDependentGates.set(gate.id, gate)
      inDegree.set(gate.id, 0) // No dependencies
    } else {
      independentGates.set(gate.id, gate)
      let count = 0

      gate.inputFrom.forEach(([sourceId]) => {
        if (!switches.has(sourceId) && !gates.has(sourceId)) {
          throw new Error(`Gate ${gate.id} references non-existent input ${sourceId}`)
        }

        if (gates.has(sourceId)) {
          count++
          const dependents = dependencies.get(sourceId) || []
          dependencies.set(sourceId, [...dependents, gate.id])
        }
      })
      inDegree.set(gate.id, count) // Store dependency count
    }
  })

  // **Topological Sorting Using Kahn's Algorithm (Queue-based approach)**
  const orderIds: number[] = []
  const queue: number[] = []

  // Initialize queue with nodes having zero dependencies
  inDegree.forEach((count, id) => {
    if (count === 0) queue.push(id)
  })

  while (queue.length) {
    const nodeId = queue.shift()!
    orderIds.push(nodeId)

    dependencies.get(nodeId)?.forEach((dependentId) => {
      inDegree.set(dependentId, inDegree.get(dependentId)! - 1)
      if (inDegree.get(dependentId) === 0) {
        queue.push(dependentId)
      }
    })
  }

  // **Cycle Detection**
  if (orderIds.length !== inDegree.size) {
    throw new Error('Cycle detected! Sorting failed.')
  }

  // **Generate Class Body**
  const classBody = `
  export class ${name}Chip {
    static inputs = new Map<number, boolean>();
    static compute(inputs: Map<number, boolean>) {
      this.inputs = new Map(inputs);
      ${orderIds
        .map((id) => {
          const gate = gates.get(id)
          if (!gate) return ''
          return `
         const nand${gate.id} = !(
          !!this.inputs.get(${gate.inputFrom[0][0]}) &&
          !!this.inputs.get(${gate.inputFrom[1][0]})
         );
         this.inputs.set(${id}, nand${id});
        `
        })
        .join('\n')}
        // Prepare outputs => bulbs
        const outputs = new Map<number, boolean>();
        ${allBulbs
          .map((bulb) => {
            return `
           outputs.set(${bulb.id},!!this.inputs.get(${bulb.inputFrom[0][0]}))
          `
          })
          .join('\n')}
        return outputs;  
    }
  }
  `
  return classBody
}
