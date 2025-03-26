import { useDispatch } from 'react-redux'
import classes from './Navbar.module.css'
import clsx from 'clsx'
import { setClickedOption } from '@renderer/store/features/fileExplorer/fileExplorerSlice'

const BuiltInChips = () => {
  const dispatch = useDispatch()
  const handleClickedBuiltInChips = () => {
    dispatch(setClickedOption('builtIn'))
  }
  return (
    <div onClick={handleClickedBuiltInChips} className={clsx(classes['navbar-option'])}>
      Built In Chips
    </div>
  )
}
export default BuiltInChips
