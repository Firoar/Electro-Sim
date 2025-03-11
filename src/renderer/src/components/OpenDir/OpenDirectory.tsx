import { useNavigate } from 'react-router'
import classes from './OpenDir.module.css'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import Loading from '../Misc/Loading'
import { setCwd, setDirContents } from '@renderer/store/features/fileExplorer/fileExplorerSlice'

const OpenDirectory = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const handleOpenDirectoryBtn = async () => {
    try {
      setLoading(true)
      const DirInfo = await window.electron.openDirectory()
      console.log('Directory Contents:', DirInfo, typeof DirInfo)

      if (DirInfo.path !== '') {
        dispatch(setCwd(DirInfo.path))
        dispatch(setDirContents(DirInfo.content))
        navigate('/app')
      }
    } catch (error) {
      console.error('Failed to open directory:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-div">
      {loading ? (
        <Loading type="spin" />
      ) : (
        <button onClick={handleOpenDirectoryBtn} className={classes['OpenDirectory-btn']}>
          Open Directory
        </button>
      )}
    </div>
  )
}
export default OpenDirectory
