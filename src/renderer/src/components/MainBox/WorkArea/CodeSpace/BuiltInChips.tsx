import { useDispatch, useSelector } from 'react-redux'
import classes from './CodeArea.module.css'
import { Content } from 'src/types/filedata'
import { RootState } from '@renderer/store/store'
import { pushToChipContents } from '@renderer/store/features/chips/chipSlice'

const chipConfig = {
  switch: { inputs: 0, outputs: 1 },
  bulb: { inputs: 1, outputs: 0 },
  nand: { inputs: 2, outputs: 1 }
}

const BuiltInChips = () => {
  const dispatch = useDispatch()
  const { currId } = useSelector((state: RootState) => state.chips)

  const handleClickedChip = (type: keyof typeof chipConfig) => {
    const chipDetails: Content = {
      id: currId + 1,
      name: type,
      type: 'builtIn',
      position: { x: 25, y: 25 },
      location: 'built-in',
      inputs: chipConfig[type].inputs,
      outputs: chipConfig[type].outputs,
      status: 'off',
      inputFrom: [],
      outputTo: []
    }
    dispatch(pushToChipContents(chipDetails))
  }

  return (
    <div className={classes['built-in-chips']}>
      {Object.keys(chipConfig).map((chip) => (
        <div
          key={chip}
          onClick={() => handleClickedChip(chip as keyof typeof chipConfig)}
          className={classes['chip']}
        >
          {chip.charAt(0).toUpperCase() + chip.slice(1)}
        </div>
      ))}
    </div>
  )
}

export default BuiltInChips
