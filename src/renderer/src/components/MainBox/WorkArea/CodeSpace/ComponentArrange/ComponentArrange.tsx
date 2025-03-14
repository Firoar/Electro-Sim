import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import classes from '../CodeArea.module.css'
import { findMaxId } from './utils/findMaxId'
import { getFileContent } from './utils/getFileContents'
import InfiniteWhiteBoard from './InfiniteWhiteBoard'
import { RootState } from '@renderer/store/store'
import {
  addWireToWires,
  setChipContents,
  setCurrId
} from '@renderer/store/features/chips/chipSlice'
import { Content } from 'src/types/filedata'

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

        const allWires: [number, number, number, number][] = result.content.flatMap(
          (chip: Content) =>
            chip.inputFrom.map((arr): [number, number, number, number] => [
              chip.id,
              arr[2],
              arr[0],
              arr[1]
            ])
        )

        dispatch(addWireToWires(allWires))
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
