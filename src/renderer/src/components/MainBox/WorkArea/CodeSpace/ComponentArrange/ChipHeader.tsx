import { RxCross2 } from 'react-icons/rx'
import classes from '../CodeArea.module.css'
import { Content } from 'src/types/filedata'
import { useDispatch } from 'react-redux'
import { removeChip } from '@renderer/store/features/chips/chipSlice'

const ChipHeader = ({ chip }: { chip: Content }) => {
  const dispatch = useDispatch()

  const handleRemoveChip = () => {
    dispatch(removeChip(chip.id))
  }

  return (
    <div className={classes['chip-header']}>
      <p className={classes['chip-name']}>
        {chip.name}-{chip.id}
      </p>
      <div className={classes['chip-cancel-btn']} onClick={handleRemoveChip}>
        <RxCross2 style={{ width: '20px', height: '20px' }} />
      </div>
    </div>
  )
}
export default ChipHeader
