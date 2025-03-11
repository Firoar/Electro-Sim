import { useDispatch } from 'react-redux'
import classes from './Navbar.module.css'
import clsx from 'clsx'
import { setClickedOption } from '@renderer/store/features/fileExplorer/fileExplorerSlice'

const File = () => {
  const dispatch = useDispatch()

  const handleClickedFile = () => {
    dispatch(setClickedOption('file'))
  }

  return (
    <div onClick={handleClickedFile} className={clsx(classes['navbar-option'])}>
      File
    </div>
  )
}
export default File
