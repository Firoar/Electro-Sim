import { RootState } from '@renderer/store/store'
import { useDispatch, useSelector } from 'react-redux'
import classes from './helperBox.module.css'
import {
  addWire,
  setInputChipBtn,
  setOutputChipBtn
} from '@renderer/store/features/chips/chipSlice'

const ConnectWireBtn = () => {
  const { inputChipBtn, outputChipBtn } = useSelector((state: RootState) => state.chips)
  const dispatch = useDispatch()

  const handleClickedConnectWire = () => {
    if (inputChipBtn.split('-')[0] === outputChipBtn.split('-')[0])
      alert('Cannot connet input and output of same chip together')
    else {
      //   alert(`Connection ${inputChipBtn} and ${outputChipBtn}`)
      dispatch(addWire(`${inputChipBtn}-${outputChipBtn}`))
      dispatch(setInputChipBtn(''))
      dispatch(setOutputChipBtn(''))
    }
  }

  if (inputChipBtn !== '' && outputChipBtn !== '') {
    return (
      <div className={classes['connect-wire-div']}>
        <button onClick={handleClickedConnectWire}>Connect Wire</button>
      </div>
    )
  }
  return null
}
export default ConnectWireBtn
