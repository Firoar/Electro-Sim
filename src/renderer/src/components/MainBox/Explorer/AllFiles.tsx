import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import classes from './Explorer.module.css'
import clsx from 'clsx'
import { FilesInfo } from 'src/types/fileTypes'

import React, { useCallback } from 'react'
import { RootState } from '@renderer/store/store'
import {
  setAllSelectedFiles,
  setAllSelectedFolders,
  setSelectedContent,
  setSelectedFile,
  setSelectedFolder
} from '@renderer/store/features/fileExplorer/fileExplorerSlice'
import { resetContents } from '@renderer/store/features/chips/chipSlice'

const AllFiles = () => {
  const { dirContents, allSelectedFolders, cwd, selectedFile, selectedContent, allSelectedFiles } =
    useSelector((state: RootState) => state.fileExplorer, shallowEqual)
  const { chipContents } = useSelector((state: RootState) => state.chips)
  const dispatch = useDispatch()

  const handleClicked = async (content: FilesInfo) => {
    dispatch(setSelectedContent(content.path))
    if (content.isFolder) {
      dispatch(setSelectedFolder(content.path))
      if (allSelectedFolders.includes(content.path)) {
        const newAllSelectedFolders = allSelectedFolders.filter(
          (path) => !path.startsWith(content.path)
        )
        console.log(newAllSelectedFolders, allSelectedFolders)
        dispatch(setAllSelectedFolders(newAllSelectedFolders))
      } else {
        dispatch(setAllSelectedFolders([...allSelectedFolders, content.path]))
      }
    } else {
      if (!allSelectedFiles.includes(content.path)) {
        dispatch(setAllSelectedFiles([...allSelectedFiles, content.path]))
      }

      if (selectedFile !== content.path) {
        if (selectedFile !== '') {
          // save the chip content
          await window.electron.saveChipContents(selectedFile, chipContents)
          dispatch(resetContents())
        }

        dispatch(setSelectedFile(content.path))
      }
    }
  }

  const getNum = useCallback(
    (targetPath: string) => {
      const rootParts = cwd.split('/').filter(Boolean)
      const targetParts = targetPath.split('/').filter(Boolean)
      return Math.abs(rootParts.length - targetParts.length)
    },
    [cwd]
  )

  const handleSubFolder = (content: FilesInfo) => {
    if (allSelectedFolders.includes(content.path)) {
      return (
        <>
          {[...content.items]
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((cnt) => !cnt.name.startsWith('.'))
            .map((cnt) => {
              if (cnt.isFolder) {
                return (
                  <React.Fragment key={cnt.name + cnt.id}>
                    <p
                      onClick={() => handleClicked(cnt)}
                      className={clsx(classes['file-box'], {
                        [classes['highlight-p']]: cnt.path === selectedContent
                      })}
                      role="button"
                      tabIndex={0}
                      style={{ paddingLeft: `${15 + getNum(cnt.path) * 5}px` }}
                    >
                      {'> '}
                      {cnt.name}
                    </p>
                    {handleSubFolder(cnt)}
                  </React.Fragment>
                )
              } else {
                return (
                  <p
                    onClick={() => handleClicked(cnt)}
                    key={cnt.name + cnt.id}
                    className={clsx(classes['file-box'], {
                      [classes['highlight-p']]: cnt.path === selectedFile
                    })}
                    role="button"
                    tabIndex={0}
                    style={{ paddingLeft: `${15 + getNum(cnt.path) * 5}px` }}
                  >
                    {cnt.name}
                  </p>
                )
              }
            })}
        </>
      )
    }
    return null
  }

  return (
    <div className={classes['all-files']}>
      {[...dirContents]
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((content) => !content.name.startsWith('.'))
        .map((content) => {
          if (content.isFolder) {
            return (
              <React.Fragment key={content.name + content.id}>
                <p
                  onClick={() => handleClicked(content)}
                  className={clsx(classes['file-box'], {
                    [classes['highlight-p']]: content.path === selectedContent
                  })}
                  role="button"
                  tabIndex={0}
                  style={{ paddingLeft: `15px` }}
                >
                  {'> '}
                  {content.name}
                </p>
                {handleSubFolder(content)}
              </React.Fragment>
            )
          } else {
            return (
              <p
                onClick={() => handleClicked(content)}
                key={content.name + content.id}
                className={clsx(classes['file-box'], {
                  [classes['highlight-p']]: content.path === selectedFile
                })}
                role="button"
                tabIndex={0}
                style={{ paddingLeft: `15px` }}
              >
                {content.name}
              </p>
            )
          }
        })}
    </div>
  )
}
export default AllFiles
