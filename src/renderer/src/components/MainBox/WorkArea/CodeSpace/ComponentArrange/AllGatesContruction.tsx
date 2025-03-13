import { GateProps } from '@renderer/components/types/gateProps'
import Draggable from 'react-draggable'
import classes from '../CodeArea.module.css'
import { calculateDim } from './utils/calculatePos'
import ChipHeader from './ChipHeader'
import ChipBody from './ChipBody'
import { useSelector } from 'react-redux'
import { RootState } from '@renderer/store/store'

const AllGatesContruction = ({ chip, handleDrag }: GateProps) => {
  const { connectionTime } = useSelector((state: RootState) => state.chips)
  return (
    <Draggable
      key={chip.name + chip.id}
      defaultPosition={{ x: chip.position.x, y: chip.position.y }}
      bounds="parent"
      disabled={connectionTime}
      onDrag={(e, data) => handleDrag(e, data, chip.id)}
    >
      <div style={calculateDim(chip.inputs, chip.outputs)} className={classes['draggable-box']}>
        <ChipHeader chip={chip} />
        <ChipBody chip={chip} />
      </div>
    </Draggable>
  )
}
export default AllGatesContruction
