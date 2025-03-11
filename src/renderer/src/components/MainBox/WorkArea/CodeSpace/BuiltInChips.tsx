import { useDispatch, useSelector } from 'react-redux'
import classes from './CodeArea.module.css'
import { Content } from 'src/types/filedata'
import { RootState } from '@renderer/store/store'
import { pushToChipContents, setSelectedChip } from '@renderer/store/features/chips/chipSlice'

const getInputs = (type: 'bulb' | 'switch' | 'nand') => {
  if (type === 'switch') return 0
  if (type === 'bulb') return 1
  if (type === 'nand') return 2
  return -1
}
const getOutputs = (type: 'bulb' | 'switch' | 'nand') => {
  if (type === 'bulb') return 0
  if (type === 'switch') return 1
  if (type === 'nand') return 1
  return -1
}
const BuiltInChips = () => {
  const dispatch = useDispatch()
  const { currId } = useSelector((state: RootState) => state.chips)

  const handleClickedChip = (type: 'bulb' | 'switch' | 'nand') => {
    alert(`Clicked ${type}`)
    dispatch(setSelectedChip({ name: type, loc: 'builtIn' }))

    // now preprae to append
    const chipDetails: Content = {
      id: currId + 1,
      name: type,
      type: 'builtIn',
      position: {
        x: 25,
        y: 25
      },
      location: 'built-in',
      inputs: getInputs(type),
      outputs: getOutputs(type),
      status: 'off',
      inputFrom: [],
      outputTo: []
    }
    dispatch(pushToChipContents(chipDetails))
  }

  return (
    <div className={classes['built-in-chips']}>
      <div onClick={() => handleClickedChip('bulb')} className={classes['chip']}>
        Bulb
      </div>
      <div onClick={() => handleClickedChip('switch')} className={classes['chip']}>
        Switch
      </div>
      <div onClick={() => handleClickedChip('nand')} className={classes['chip']}>
        Nand
      </div>
    </div>
  )
}
export default BuiltInChips
