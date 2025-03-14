import { setInputChipBtn } from '@renderer/store/features/chips/chipSlice'
import { RootState } from '@renderer/store/store'
import { useDispatch, useSelector } from 'react-redux'
import classes from './helperBox.module.css'

const InputChipPos = () => {
  const dispatch = useDispatch()
  const { inputChipBtn } = useSelector((state: RootState) => state.chips)
  const handleClear = () => {
    dispatch(setInputChipBtn(''))
  }
  return (
    <div className={classes['chip-btn-box']}>
      <label htmlFor="chip-input">Chip Input: </label>
      <input value={inputChipBtn} disabled type="text" id="chip-input" name="chip-input" />
      {inputChipBtn !== '' && <button onClick={handleClear}>Clear</button>}
    </div>
  )
}

export default InputChipPos
