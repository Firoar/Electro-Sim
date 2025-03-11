import { useEffect, useState } from 'react'
import classes from './CodeArea.module.css'
import { CiCirclePlus } from 'react-icons/ci'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/store/store'
import { setSelectedChip } from '@renderer/store/features/chips/chipSlice'

type ChipData = {
  name: string
  loc: string
}

const CustomChips = () => {
  const { selectedFile } = useSelector((state: RootState) => state.fileExplorer)
  const dispatch = useDispatch()
  const [localChips, setLocalChips] = useState<ChipData[]>([])

  const getCustomChips = async () => {
    if (!selectedFile) return
    try {
      const customChips = await window.electron.getCustomChips(selectedFile)
      setLocalChips(customChips.map((ch) => ({ name: ch.name, loc: ch.path })))
    } catch (error) {
      console.error('Error fetching custom chips:', error)
    }
  }

  useEffect(() => {
    getCustomChips()
  }, [selectedFile])

  const handleClickedChip = (chip: ChipData) => {
    alert(chip.name)
    dispatch(setSelectedChip(chip))
  }

  return (
    <div
      className={classes['custom-chips']}
      style={{ height: `${localChips.length * 100 + 50}px` }}
    >
      <div className={classes['add-btn']}>
        <CiCirclePlus className={classes['add-icon']} />
      </div>
      {localChips.map((chip, index) => (
        <div
          key={chip.name || index}
          className={classes['chip']}
          onClick={() => handleClickedChip(chip)}
        >
          {chip.name}
        </div>
      ))}
    </div>
  )
}

export default CustomChips
