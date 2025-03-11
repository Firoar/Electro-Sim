import BuiltInChips from './BuiltInChips'
import classes from './CodeArea.module.css'
import CustomChips from './CustomChips'

const ChipsBar = () => {
  return (
    <div className={classes['chips-bar']}>
      <BuiltInChips />
      <CustomChips />
    </div>
  )
}
export default ChipsBar
