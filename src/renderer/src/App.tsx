import { useEffect, useState } from 'react'
import MainBox from './components/MainBox/MainBox'
import Navbar from './components/Navbar/Navbar'
// import chipGenerator from './utils/chipGenerator.ts'

// type Circuit =
//   | {
//       id: number
//       type: 'switch'
//       status: 'on' | 'off'
//       outputs: number
//       outputWire: number[]
//     }
//   | {
//       id: number
//       type: 'nand'
//       inputs: number
//       outputs: number
//       inputWire: number[]
//       outputWire: number[]
//     }
//   | {
//       id: number
//       type: 'bulb'
//       status: 'on' | 'off'
//       inputs: number
//       inputWire: number[]
//     }
//   | {
//       id: number
//       type: 'chip'
//       inputs: number
//       outputs: number
//     }

function App(): JSX.Element {
  // const circuit: Circuit[] = [
  //   { id: 5, type: 'switch', outputs: 1, status: 'on', outputWire: [1] },
  //   { id: 1, type: 'nand', inputs: 2, outputs: 1, inputWire: [5, 5], outputWire: [2] },
  //   { id: 2, type: 'nand', inputs: 2, outputs: 1, inputWire: [1, 1], outputWire: [4] },
  //   { id: 4, type: 'nand', inputs: 2, outputs: 1, inputWire: [2, 2], outputWire: [3] },
  //   { id: 3, type: 'bulb', inputs: 1, status: 'off', inputWire: [4] }
  // ]

  // const halfAdder: Circuit[] = [
  //   { id: 1, type: 'switch', outputs: 2, status: 'on', outputWire: [3, 4] },
  //   { id: 2, type: 'switch', outputs: 2, status: 'on', outputWire: [3, 5] },
  //   { id: 3, type: 'nand', inputs: 2, outputs: 4, inputWire: [1, 2], outputWire: [4, 5, 7, 7] },
  //   { id: 4, type: 'nand', inputs: 2, outputs: 1, inputWire: [1, 3], outputWire: [6] },
  //   { id: 5, type: 'nand', inputs: 2, outputs: 1, inputWire: [2, 3], outputWire: [6] },
  //   { id: 6, type: 'nand', inputs: 2, outputs: 1, inputWire: [4, 5], outputWire: [9] },
  //   { id: 7, type: 'nand', inputs: 2, outputs: 1, inputWire: [3, 3], outputWire: [8] },
  //   { id: 8, type: 'bulb', inputs: 1, status: 'off', inputWire: [6] },
  //   { id: 9, type: 'bulb', inputs: 1, status: 'off', inputWire: [7] }
  // ]

  // // chipGenerator('test', circuit)
  // const inputOfAdder = new Map<number, boolean>()

  // halfAdder.forEach((cir) => {
  //   if (cir.type === 'switch') {
  //     inputOfAdder.set(cir.id, cir.status === 'on')
  //   }
  // })
  // console.log(inputOfAdder)
  // chipGenerator('halfAdder', halfAdder)
  const [isSaved, setIsSaved] = useState<Boolean>(false)

  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (isSaved) {
        event.preventDefault()
        event.returnValue = false
        await saveDataBeforeExit()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isSaved])

  const saveDataBeforeExit = async () => {
    alert('saving')
    setIsSaved(true)
    await window.electron.saveBeforeQuit()
  }

  return (
    <div className="main-div">
      <Navbar />
      <MainBox />
    </div>
  )
}

export default App
