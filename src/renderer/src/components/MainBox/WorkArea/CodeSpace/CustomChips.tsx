import { useEffect, useState } from 'react'
import classes from './CodeArea.module.css'
import { CiCirclePlus } from 'react-icons/ci'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/store/store'
import { pushToChipContents, setSelectedChip } from '@renderer/store/features/chips/chipSlice'
import { Content } from 'src/types/filedata'

type ChipData = {
  name: string
  loc: string
}

const CustomChips = () => {
  const { selectedFile, cwd } = useSelector((state: RootState) => state.fileExplorer)
  const { currId } = useSelector((state: RootState) => state.chips)
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

  const handleClickedChip = async (chip: ChipData) => {
    dispatch(setSelectedChip(chip))
    const data = await window.electron.retrieveContentofFile(chip.loc, cwd)

    if ('error' in data) {
      console.log('Error in retireving the file')
      return
    }

    // now send location get inputs,get outputs,and get compiled location
    const chipDetails: Content = {
      id: currId + 1,
      name: chip.name,
      type: 'custom',
      position: { x: 25, y: 25 },
      location: data.location,
      inputs: data.inputIds.length,
      outputs: data.outputIds.length,
      status: 'off',
      inputFrom: [],
      outputTo: []
    }
    dispatch(pushToChipContents(chipDetails))
  }

  const handleClickedAddCustomChip = async () => {
    const result = await window.electron.getChipFromDiffrentPlace(selectedFile)
    if ('error' in result || 'reason' in result) {
      console.log(result)
      return
    } else if ('path' in result) {
      setLocalChips((prev) => {
        const name = result.path.split('/').pop()
        console.log(name)
        const newChip: ChipData = {
          name: name || 'new_chip.chip',
          loc: result.path
        }
        return [...prev, newChip]
      })
    }
  }

  return (
    <div
      className={classes['custom-chips']}
      style={{ height: `${localChips.length * 100 + 50}px` }}
    >
      <div onClick={handleClickedAddCustomChip} className={classes['add-btn']}>
        <CiCirclePlus className={classes['add-icon']} />
      </div>
      {localChips.map((chip, index) => (
        <div
          key={chip.name || index}
          className={classes['chip']}
          onClick={() => handleClickedChip(chip)}
        >
          {chip.name.replace('.chip', '')}
        </div>
      ))}
    </div>
  )
}

export default CustomChips
