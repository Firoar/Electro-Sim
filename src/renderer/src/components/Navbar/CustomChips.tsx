import { useDispatch } from 'react-redux'
import classes from './Navbar.module.css'
import clsx from 'clsx'
import { setClickedOption } from '@renderer/store/features/fileExplorer/fileExplorerSlice'
const CustomChips = () => {
  const dispatch = useDispatch()
  const handleClickedCustomChips = () => {
    dispatch(setClickedOption('custom'))
  }
  return (
    <div onClick={handleClickedCustomChips} className={clsx(classes['navbar-option'])}>
      Custom Chips
    </div>
  )
}
export default CustomChips
