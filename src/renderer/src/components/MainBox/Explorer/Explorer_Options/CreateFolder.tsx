import { MdCreateNewFolder } from 'react-icons/md'
import classes from '../Explorer.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/store/store'
import { setDirContents } from '@renderer/store/features/fileExplorer/fileExplorerSlice'

const CreateFolder = () => {
  const { cwd } = useSelector((state: RootState) => state.fileExplorer)
  const dispatch = useDispatch()
  const handleClickedCreateFolder = async () => {
    const openedFolder = await window.electron.openDirectory(cwd)

    if (!openedFolder.path) {
      alert('No folder selected')
      return
    }

    let folderCreated = false

    while (!folderCreated) {
      const result = await window.electron.createFolderPrompt()
      if (result === null) break

      const found = openedFolder.content.find((ele) => ele.name === result)

      if (found) {
        alert('This folder name already exists. Choose another one.')
      } else {
        folderCreated = true
        const created = await window.electron.createFolder(openedFolder.path, result)

        console.log(created)
        if (created.success) {
          const refetchedAllFiles = await window.electron.getAllFiles(cwd)

          dispatch(setDirContents(refetchedAllFiles.content))
          alert('Folder created successfully!')
        }
      }
    }
  }

  return (
    <div className={classes['circluar-btn']} onClick={handleClickedCreateFolder}>
      <MdCreateNewFolder />
    </div>
  )
}
export default CreateFolder
