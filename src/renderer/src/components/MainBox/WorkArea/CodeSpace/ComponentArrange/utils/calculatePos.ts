import { Content } from 'src/types/filedata'

export const calculatePos = (i: number, type: 'in' | 'out') => {
  const style: React.CSSProperties =
    type === 'in'
      ? {
          position: 'absolute',
          top: `${i * 50 + 15}px`,
          left: '15px',
          width: '20px',
          height: '20px',
          border: 'solid 2px black',
          background: 'lightgreen',
          borderRadius: '50%'
        }
      : {
          position: 'absolute',
          top: `${i * 50 + 15}px`,
          right: '15px',
          width: '20px',
          height: '20px',
          border: 'solid 2px black',
          background: '#F08080',
          borderRadius: '50%'
        }
  return style
}

export const calculateDim = (numIn: number, numOut: number) => {
  const style: React.CSSProperties = {
    width: '150px',
    height: `${Math.max(numIn, numOut) * 50 + 30}px`, // 30 for gate name 50 for each
    border: 'solid 3px purple'
  }
  return style
}

export const bulbDim = () => {
  const style: React.CSSProperties = {
    width: '150px',
    height: `${30 + 50}px`
  }
  return style
}

export const giveCenterPositionOfInput = (chip: Content, inputId: number) => {
  // i have x and y of chip top left
  const finalX = chip.position.x + 15 + 20
  const finalY = chip.position.y + 30 + inputId * 50 + 15 + 23 // 10 because the block is 20*20

  return [finalX, finalY]
}

export const giveCenterPositionOfOutput = (chip: Content, outputId: number) => {
  const finalX = chip.position.x + 150 - 15 - 0
  const finalY = chip.position.y + 30 + outputId * 50 + 15 + 23
  return [finalX, finalY]
}
