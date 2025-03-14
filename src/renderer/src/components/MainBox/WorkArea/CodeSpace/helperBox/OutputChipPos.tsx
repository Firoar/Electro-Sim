import { setOutputChipBtn } from '@renderer/store/features/chips/chipSlice'
import { RootState } from '@renderer/store/store'
import { useDispatch, useSelector } from 'react-redux'
import classes from './helperBox.module.css'

const OutputChipPos = () => {
  const dispatch = useDispatch()
  const { outputChipBtn } = useSelector((state: RootState) => state.chips)

  const handleClear = () => {
    dispatch(setOutputChipBtn(''))
  }

  return (
    <div className={classes['chip-btn-box']}>
      <label htmlFor="chip-input">Chip Output : </label>
      <input value={outputChipBtn} disabled type="text" id="chip-output" name="chip-output" />
      {outputChipBtn !== '' && <button onClick={handleClear}>Clear</button>}
    </div>
  )
}
export default OutputChipPos
