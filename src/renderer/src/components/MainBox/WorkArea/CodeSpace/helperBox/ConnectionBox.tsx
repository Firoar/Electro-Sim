import { toggleConnectionTime } from '@renderer/store/features/chips/chipSlice'
import { useDispatch } from 'react-redux'
import classes from './helperBox.module.css'

const ConnectionBox = () => {
  const dispatch = useDispatch()
  const handleToggleCheckBox = () => {
    dispatch(toggleConnectionTime())
  }

  return (
    <div className={classes['connection-box']}>
      <input type="checkbox" name="connection" id="connection" onChange={handleToggleCheckBox} />
      <label htmlFor="connection">Connection</label>
    </div>
  )
}

export default ConnectionBox
