import { Content } from 'src/types/filedata'
import classes from '../CodeArea.module.css'
import { calculatePos, giveCenterPositionOfInput } from './utils/calculatePos'
import { useDispatch, useSelector } from 'react-redux'
import { setInputChipBtn, toggleChipStatus } from '@renderer/store/features/chips/chipSlice'
import { RootState } from '@renderer/store/store'

const ChipInputs = ({ chip }: { chip: Content }) => {
  const dispatch = useDispatch()
  const { connectionTime } = useSelector((state: RootState) => state.chips)

  const handleInputClicked = (chip: Content, i: number) => {
    if (!connectionTime) return

    const inputKey = `${chip.id}-${i}`

    if (chip.name === 'nand') {
      const alreadyConnected = chip.inputFrom.some(([_, __, port]) => port === i)
      if (alreadyConnected) {
        alert('You can only put one wire to the input port')
        return
      }
      dispatch(setInputChipBtn(inputKey))
    } else if (chip.name === 'bulb') {
      if (chip.inputFrom.length > 0) {
        alert('Bulb already has an input. Cannot connect more than one')
        return
      }
      dispatch(setInputChipBtn(inputKey))
    }
  }

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
        <div
          onClick={() => handleInputClicked(chip, i)}
          key={`${i}-in-${chip.id}`}
          style={calculatePos(i, 'in')}
        ></div>
      ))}
    </div>
  )
}

export default ChipInputs
