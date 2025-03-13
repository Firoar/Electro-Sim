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
  return {
    width: '150px',
    height: `${Math.max(numIn, numOut) * 50 + 30}px` // 30 for gate name 50 for each
  }
}

export const bulbDim = () => {
  const style: React.CSSProperties = {
    width: '150px',
    height: `${30 + 50}px`
  }
  return style
}
