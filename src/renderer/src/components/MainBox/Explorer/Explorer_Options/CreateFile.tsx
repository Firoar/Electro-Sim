import { AiFillFileAdd } from 'react-icons/ai'
import classes from '../Explorer.module.css'
import { useDispatch, useSelector } from 'react-redux'
import path from 'path-browserify'
import { RootState } from '@renderer/store/store'
import { setDirContents } from '@renderer/store/features/fileExplorer/fileExplorerSlice'

const CreateFile = () => {
  const dispatch = useDispatch()
  const { cwd, selectedContent, selectedFile } = useSelector(
    (state: RootState) => state.fileExplorer
  )

  const handleClickedCreateFile = async () => {
    const pathName = selectedContent
      ? selectedContent === selectedFile
        ? path.dirname(selectedContent)
        : selectedContent
      : cwd

    await window.electron.createFile(pathName)
    const refetchedAllFiles = await window.electron.getAllFiles(cwd)

    dispatch(setDirContents(refetchedAllFiles.content))
  }

  return (
    <div className={classes['circluar-btn']} onClick={handleClickedCreateFile}>
      <AiFillFileAdd />
    </div>
  )
}
export default CreateFile
