import { RootState } from '@renderer/store/store'
import classes from '../CodeArea.module.css'
import DrawGates from './DrawGates'
import { useSelector } from 'react-redux'
import WireCanvas from './WireCanvas'

const InfiniteWhiteBoard = () => {
  const { dimensions } = useSelector((state: RootState) => state.chips)

  return (
    <div
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        background: `hsl(${0.15 * 360}, 70%, 60%)`
      }}
      className={classes['white-board']}
    >
      <DrawGates />
      <WireCanvas width={dimensions.width} height={dimensions.height} />
    </div>
  )
}

export default InfiniteWhiteBoard
