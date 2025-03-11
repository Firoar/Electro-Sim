import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RxCross2 } from 'react-icons/rx'
import classes from './WorkArea.module.css'
import clsx from 'clsx'
import React from 'react'
import { RootState } from '@renderer/store/store'
import {
  setAllSelectedFiles,
  setSelectedFile
} from '@renderer/store/features/fileExplorer/fileExplorerSlice'
import { resetContents } from '@renderer/store/features/chips/chipSlice'

const TabBar = () => {
  const { allSelectedFiles, selectedFile } = useSelector(
    (state: RootState) => state.fileExplorer,
    shallowEqual
  )
  const { chipContents } = useSelector((state: RootState) => state.chips)
  const dispatch = useDispatch()

  const handleRemoveFromTabs = (file: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newAllSelectedFiles = allSelectedFiles.filter((f) => f !== file)
    dispatch(setAllSelectedFiles(newAllSelectedFiles))
  }

  const handleSelectTab = async (file: string) => {
    if (selectedFile !== file) {
      if (selectedFile !== '') {
        // save the chip content
        await window.electron.saveChipContents(selectedFile, chipContents)
        dispatch(resetContents())
      }

      dispatch(setSelectedFile(file))
    }
  }

  return (
    <div className={classes['tab-bar']}>
      {allSelectedFiles.map((file: string) => {
        return (
          <div
            className={clsx(classes['tab'], {
              [classes['underline']]: file === selectedFile
            })}
            key={file}
            onClick={() => handleSelectTab(file)}
          >
            <p>{file.split('/').pop()}</p>
            <RxCross2 onClick={(e) => handleRemoveFromTabs(file, e)} className={classes['cross']} />
          </div>
        )
      })}
    </div>
  )
}
export default TabBar
