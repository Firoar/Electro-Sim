import { readdir, stat } from 'fs/promises'
import fs from 'fs'
import path, { join } from 'path'
import { FilesInfo } from '../types/fileTypes'
import { Content, FileData } from '../types/filedata'

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

    let data: FileData
    try {
      data = JSON.parse(content)
    } catch (error) {
      throw new Error(`Invalid JSON format in file: ${path}`)
    }

    data.content = chipContents
    const { usefulInputs, usefulOutputs } = await countUsefulInputsandOutputs(chipContents)
    data.inputIds = usefulInputs
    data.outputIds = usefulOutputs

    fs.writeFileSync(path, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving to file:', error)
  }
}

export const makeCompiledTrue = async (path: string) => {
  try {
    if (!fs.existsSync(path)) {
      throw new Error(`File not found: ${path}`)
    }

    const content = fs.readFileSync(path, 'utf-8')

    let data: FileData
    try {
      data = JSON.parse(content)
    } catch (error) {
      throw new Error(`Invalid JSON format in file: ${path}`)
    }
    data.compiled = true

    fs.writeFileSync(path, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving to file:', error)
  }
}

const countUsefulInputsandOutputs = async (chipContents: Content[]) => {
  const usefulInputs: number[] = []
  const usefulOutputs: number[] = []

  chipContents.forEach((chip) => {
    if (chip.name === 'bulb') {
      if (chip.inputFrom.length === chip.inputs) {
        usefulOutputs.push(chip.id)
      }
    } else if (chip.name === 'switch') {
      if (chip.outputTo.length >= chip.outputs) {
        usefulInputs.push(chip.id)
      }
    }
  })

  usefulInputs.sort((a, b) => a - b)
  usefulOutputs.sort((a, b) => a - b)

  return {
    usefulInputs,
    usefulOutputs
  }
}

const getImportsofCustomChips = (customGates: Content[]) => {
  const importStatement: string[] = []

  customGates.forEach((gate) => {
    const fileName = path.basename(gate.location)
    const compiledFileName = fileName.replace('.chip', 'Chip')
    const str = `import { ${compiledFileName} } from "${gate.location.replace(fileName, fileName.replace('.chip', '.mjs'))}"`
    importStatement.push(str)
  })
  return importStatement
}

const getChipDetails = (location: string) => {
  const data = fs.readFileSync(location, 'utf-8')
  const fileInfo: FileData = JSON.parse(data)
  return fileInfo
}

const getCustomChipId = (id: number, arr: number[]) => {
  return arr[id]
}

// const getCustomChipIndexofValue = (val: string, arr: number[]) => {
//   const index = arr.findIndex((value) => value === Number(val))
//   return index
// }

export const evaluateChip = (name: string, chips: Content[]) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid chip name provided')
  }

  const bulbs = new Map<number, Content>()
  const bulbs_t2 = new Map<number, Content>()
  const switches = new Map<number, Content>()
  const gates = new Map<number, Content>()
  const allGates: Content[] = []
  const allBulbs: Content[] = []
  const customGates = new Set<string>()
  const cg: Content[] = []

  const inputs = new Map<string, boolean>()

  // Categorizing chips into bulbs, switches, and gates
  chips.forEach((chip) => {
    if (chip.inputFrom.length === chip.inputs) {
      if (chip.name === 'bulb') {
        bulbs.set(chip.id, chip)
        allBulbs.push(chip)
      } else if (chip.name === 'switch') {
        if (chip.outputTo.length >= chip.outputs) {
          switches.set(chip.id, chip)
          chip.outputTo.forEach((arr) => {
            const str = `${chip.id}-${arr[2]}`
            inputs.set(str, chip.status === 'on')
          })
        }
      } else if (chip.name === 'bulb_t2') {
        bulbs_t2.set(chip.id, chip)
        allBulbs.push(chip)
        const str = `${chip.id}-${1}`
        inputs.set(str, chip.status === 'on')
      } else {
        gates.set(chip.id, chip)
        allGates.push(chip)
        if (chip.type === 'custom') {
          if (!customGates.has(chip.name)) {
            customGates.add(chip.name)
            cg.push(chip)
          }
        }
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
        if (!switches.has(sourceId) && !gates.has(sourceId) && !bulbs_t2.has(sourceId)) {
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

  // **Initialize queue with nodes having zero dependencies**
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
  const importStatements = getImportsofCustomChips(cg)

  // **Generate Class Body**
  const classBody = `
// importing all static methods of custom chips
${importStatements.map((statement) => statement).join('\n')}


export class ${name}Chip {
      static #getCustomChipIndexofValue(val, arr){
       const index = arr.findIndex((value) => value === Number(val))
       return index
     }
   
    static compute(inputs) {
        const localInputs = new Map(inputs);
        ${orderIds
          .map((id) => {
            const gate = gates.get(id)
            if (!gate) return ''
            if (gate.name === 'nand') {
              return `
        const nand${gate.id} = !(
            !!localInputs.get("${gate.inputFrom[0][0]}-${gate.inputFrom[0][1]}") &&
            !!localInputs.get("${gate.inputFrom[1][0]}-${gate.inputFrom[1][1]}")
        );
        localInputs.set("${id}-0", nand${id});
        `
            } else {
              // this is built in chip
              const customInputName = `${gate.name.replace('.chip', '')}Inputs${gate.id}`
              const customChipName = `${gate.name.replace('.chip', '')}${gate.id}`
              const location = gate.location.replace('.chips/', '')
              const chipFileData = getChipDetails(location)
              const jod = `${gate.name.replace(/\.chip$/, '')}Chip`
              return `
              const ${customInputName}=new Map();
              ${gate.inputFrom
                .map((arr) => {
                  return `${customInputName}.set("${getCustomChipId(arr[2], chipFileData.inputIds)}-0",!!localInputs.get("${arr[0]}-${arr[1]}"));`
                })
                .join('\n')}
              
              const ${customChipName}=${jod}.compute(${customInputName})

              ${customChipName}.forEach((val,key)=>{
              const jod = this.#getCustomChipIndexofValue(key.split("-")[0],[${chipFileData.outputIds}])
              const str="${gate.id}-"+jod;
              localInputs.set(str,val)
              })
              `
            }
          })
          .join('\n')}
        
        // Prepare outputs => bulbs
        const outputs = new Map();

        ${allBulbs
          .map((bulb) => {
            return `
            ${bulb.inputFrom
              .map((arr) => {
                return `outputs.set("${bulb.id}-${arr[2]}", !!localInputs.get("${bulb.inputFrom[0][0]}-${bulb.inputFrom[0][1]}"));`
              })
              .join('\n')}
        `
          })
          .join('\n')}
          
        return outputs;
    }
}

export default ${name}Chip; // Ensure default export for dynamic import
`

  return { classBody: classBody, inputs: inputs }
}

async function loadGeneratedClass(filePath: string) {
  try {
    const module = await import(`file://${filePath}?t=${Date.now()}`)
    return module.default || module
  } catch (error) {
    console.error('❌ Error importing file:', error)
  }
}

export const getOutputs = async (filePath: string, inputs: Map<string, boolean>) => {
  const generatedChip = await loadGeneratedClass(filePath)
  if (generatedChip.compute) {
    const outputs = await generatedChip.compute(inputs)

    return outputs
  }
}

export const getExactLocation = (filePath: string, cwd: string) => {
  const p = path.relative(cwd, filePath)
  const finalPath = path.join(cwd, '.chips', p)
  return finalPath
}
