import { Content } from 'src/types/filedata'
import classes from '../CodeArea.module.css'
import { calculatePos } from './utils/calculatePos'
import { useDispatch } from 'react-redux'
import { toggleChipStatus } from '@renderer/store/features/chips/chipSlice'

const ChipInputs = ({ chip }: { chip: Content }) => {
  const dispatch = useDispatch()

  const handleToggleSwitch = () => {
    dispatch(toggleChipStatus(chip.id))
  }

  if (chip.name === 'switch') {
    return (
      <div className={classes['chip-inputs']}>
        {/* inputs (for switch, there are none) */}
        <label className="switch">
          <input type="checkbox" checked={chip.status !== 'off'} onChange={handleToggleSwitch} />
          <span className="slider round"></span>
        </label>
      </div>
    )
  }

  return (
    <div className={classes['chip-inputs']}>
      {/* inputs */}
      {Array.from({ length: chip.inputs }, (_, i) => (
        <div key={`${i}-in-${chip.id}`} style={calculatePos(i, 'in')}></div>
      ))}
    </div>
  )
}

export default ChipInputs
