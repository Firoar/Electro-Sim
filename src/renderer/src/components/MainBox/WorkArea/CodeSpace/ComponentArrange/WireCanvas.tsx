import { RootState } from '@renderer/store/store'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { canvasOperations } from './utils/canvasOperations'

const wireCanvasStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none'
}

const WireCanvas = ({ width, height }: { width: number; height: number }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { wires, chipContents } = useSelector((state: RootState) => state.chips)
  useEffect(() => {
    if (canvasRef.current) {
      canvasOperations(canvasRef.current, wires, chipContents)
    }
  }, [wires, chipContents])

  return <canvas style={wireCanvasStyle} width={width} height={height} ref={canvasRef}></canvas>
}
export default WireCanvas
