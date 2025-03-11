import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import classes from '../CodeArea.module.css'
import { findMaxId } from './utils/findMaxId'
import { getFileContent } from './utils/getFileContents'
import InfiniteWhiteBoard from './InfiniteWhiteBoard'
import { RootState } from '@renderer/store/store'
import { setChipContents, setCurrId } from '@renderer/store/features/chips/chipSlice'
// import { setChipContents, setCurrId } from 'public/renderer/src/store/features/chips/chipSlice'

const ComponentArrange = () => {
  const dispatch = useDispatch()
  const { selectedFile } = useSelector((state: RootState) => state.fileExplorer)

  useEffect(() => {
    const fetchContent = async () => {
      const result = await getFileContent(selectedFile)

      if ('error' in result) {
        console.log(result)
      } else {
        dispatch(setChipContents(result.content))
        dispatch(setCurrId(findMaxId(result.content)))
      }
    }

    if (selectedFile) {
      fetchContent()
    }
  }, [selectedFile])

  return (
    <div className={classes['component-arrange']}>
      <InfiniteWhiteBoard />
    </div>
  )
}

export default ComponentArrange
