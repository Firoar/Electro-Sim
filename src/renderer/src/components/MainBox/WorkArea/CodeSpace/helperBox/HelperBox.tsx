import { useSelector } from 'react-redux'
import ConnectionBox from './ConnectionBox'
import classes from './helperBox.module.css'
import InputChipPos from './InputChipPos'
import OutputChipPos from './OutputChipPos'
import { RootState } from '@renderer/store/store'
import ConnectWireBtn from './ConnectWireBtn'
import EvaluateButton from './EvaluateButton'

const HelperBox = () => {
  const { connectionTime } = useSelector((state: RootState) => state.chips)

  return (
    <div className={classes['helper-box']}>
      <EvaluateButton />
      <ConnectionBox />
      {connectionTime && (
        <>
          <InputChipPos />
          <OutputChipPos />
          <ConnectWireBtn />
        </>
      )}
    </div>
  )
}

export default HelperBox
