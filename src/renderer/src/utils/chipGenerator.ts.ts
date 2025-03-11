type Circuit =
  | {
      id: number
      type: 'switch'
      status: 'on' | 'off'
      outputs: number
      outputWire: number[]
    }
  | {
      id: number
      type: 'nand'
      inputs: number
      outputs: number
      inputWire: number[]
      outputWire: number[]
    }
  | {
      id: number
      type: 'bulb'
      status: 'on' | 'off'
      inputs: number
      inputWire: number[]
    }
  | {
      id: number
      type: 'chip'
      inputs: number
      outputs: number
    }

export default function chipGenerator(name: string, circuits: Circuit[]) {
  const allSwitches = circuits.filter((cir) => cir.type === 'switch')
  const allBulbs = circuits.filter((cir) => cir.type === 'bulb')

  const switchIds = new Set<number>()
  allSwitches.forEach((sw) => switchIds.add(sw.id))

  const switchDependentGates = circuits.filter(
    (cir) => cir.type === 'nand' && cir.inputWire.every((id) => switchIds.has(id))
  )
  const allGates = new Map<number, Circuit>()

  circuits.forEach((cir) => {
    if (cir.type === 'nand') {
      allGates.set(cir.id, cir)
    }
  })

  const switchDependentIds = new Set<number>(switchDependentGates.map((g) => g.id))
  const gateDependentGates = circuits.filter(
    (cir) => cir.type === 'nand' && !switchDependentIds.has(cir.id)
  )

  console.log(`Circuit: ${name}`)
  console.log(`Switches:`, allSwitches)
  console.log(`Bulbs:`, allBulbs)
  console.log(`Switch-dependent NAND gates:`, switchDependentGates)
  console.log(`Other NAND gates:`, gateDependentGates)

  // 🔹 Define dependencies using Map
  const dependencies = new Map<number, number[]>()
  const vec: { id: number; val: number }[] = []

  switchDependentGates.forEach((gate) => {
    vec.push({ id: gate.id, val: 0 })
  })

  gateDependentGates.forEach((gate) => {
    if (gate.type === 'nand') {
      gate.inputWire.forEach((id) => {
        if (!dependencies.has(id)) {
          dependencies.set(id, [])
        }
        dependencies.get(id)!.push(gate.id)
      })
    }
  })

  gateDependentGates.forEach((gate) => {
    if (gate.type === 'nand') {
      const count = gate.inputWire.reduce((acc, id) => acc + (switchIds.has(id) ? 0 : 1), 0)
      vec.push({ id: gate.id, val: count })
    }
  })

  console.log('vec:', vec)
  console.log('dependencies:', dependencies)

  // 🔹 Perform Topological Sort
  const orderIds: number[] = []

  while (vec.length) {
    const zeroValIndex = vec.findIndex((obj) => obj.val === 0)

    // If no element with `val === 0` is found, we have a cycle.
    if (zeroValIndex === -1) {
      console.error('Cycle detected! Sorting failed.')
      return
    }

    // Get the ID of the node
    const nodeId = vec[zeroValIndex].id
    orderIds.push(nodeId)

    // Reduce dependency count for its dependent nodes
    dependencies.get(nodeId)?.forEach((dependentId) => {
      const dependentNode = vec.find((obj) => obj.id === dependentId)
      if (dependentNode) {
        dependentNode.val -= 1
      }
    })

    // Remove the processed node
    vec.splice(zeroValIndex, 1)
  }

  console.log('Topological Order:', orderIds)

  // now i have topo order , now build the class
  const classBody = `
  export class ${name}Chip {
    static inputs = new Map<number, boolean>();

    static compute(inputs: Map<number, boolean>) {
      this.inputs = new Map(inputs);
      ${orderIds
        .map((id) => {
          const gate = allGates.get(id)
          if (!gate || gate.type !== 'nand') return ''
          return `
          const nand${id} = !(
            !!this.inputs.get(${gate.inputWire[0]}) &&
            !!this.inputs.get(${gate.inputWire[1]})
          );
          this.inputs.set(${id}, nand${id});
        `
        })
        .join('\n')}
        
      // Prepare outputs => bulbs
    const outputs = new Map<number, boolean>();

    ${allBulbs
      .map((bulb) => {
        return `outputs.set(${bulb.id}, !!this.inputs.get(${bulb.inputWire[0]}));`
      })
      .join('\n')}
      
    return outputs;

    }
  }
`

  console.log(classBody)
}
