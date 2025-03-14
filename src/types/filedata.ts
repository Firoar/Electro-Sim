export type FileData = {
  name: string
  location: string
  content: Content[]
  inputIds: number[]
  outputIds: number[]
  compiled :  boolean
}

export type Content = {
  id: number
  name: string
  type: 'builtIn' | 'cutom'
  position: { x: number; y: number }
  location: string
  inputs: number
  outputs: number
  status?: 'on' | 'off'
  inputFrom: NumOrPair[]
  outputTo: NumOrPair[]
  
}

type NumOrPair =  [number, number,number] // destinay chip id, id , myId   => i already have my chipId
