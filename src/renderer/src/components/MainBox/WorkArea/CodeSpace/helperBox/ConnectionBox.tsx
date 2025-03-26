import { toggleConnectionTime } from '@renderer/store/features/chips/chipSlice'
import { useDispatch, useSelector } from 'react-redux'
import classes from './helperBox.module.css'
import { RootState } from '@renderer/store/store'

const ConnectionBox = () => {
  const dispatch = useDispatch()
  const { connectionTime } = useSelector((state: RootState) => state.chips)
  const handleToggleCheckBox = () => {
    dispatch(toggleConnectionTime())
  }

  return (
    <div className={classes['connection-box']}>
      <input
        checked={connectionTime}
        type="checkbox"
        name="connection"
        id="connection"
        onChange={handleToggleCheckBox}
      />
      <label htmlFor="connection">Connection</label>
    </div>
  )
}

export default ConnectionBox
