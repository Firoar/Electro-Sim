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

  const handleRemoveFromTabs = async (file: string, e: React.MouseEvent) => {
    e.stopPropagation()

    //save the current selcted file
    if (selectedFile !== '' && selectedFile.endsWith('.chip')) {
      // save the chip content
      await window.electron.saveChipContents(selectedFile, chipContents)
      dispatch(resetContents())
    }

    const newAllSelectedFiles = allSelectedFiles.filter((f) => f !== file)
    dispatch(setAllSelectedFiles(newAllSelectedFiles))

    // new selectedFile
    dispatch(setSelectedFile(newAllSelectedFiles.at(-1) || ''))
  }

  const handleSelectTab = async (file: string) => {
    if (selectedFile !== file) {
      if (selectedFile !== '' && selectedFile.endsWith('.chip')) {
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
            {file === selectedFile && (
              <RxCross2
                onClick={(e) => handleRemoveFromTabs(file, e)}
                className={classes['cross']}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
export default TabBar
