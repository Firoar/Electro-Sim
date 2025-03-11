import { IoMdRefresh } from 'react-icons/io'
import classes from '../Explorer.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/store/store'
import { setDirContents } from '@renderer/store/features/fileExplorer/fileExplorerSlice'

const RefreshFiles = () => {
  const dispatch = useDispatch()

  const { cwd } = useSelector((state: RootState) => state.fileExplorer)

  const handleClickedRefreshFiles = async () => {
    const refetchedAllFiles = await window.electron.getAllFiles(cwd)
    dispatch(setDirContents(refetchedAllFiles.content))
  }

  return (
    <div className={classes['circluar-btn']} onClick={handleClickedRefreshFiles}>
      <IoMdRefresh />
    </div>
  )
}
export default RefreshFiles
