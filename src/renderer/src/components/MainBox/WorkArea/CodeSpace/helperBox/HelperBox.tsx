import ConnectionBox from './ConnectionBox'
import classes from './helperBox.module.css'

const HelperBox = () => {
  return (
    <div className={classes['helper-box']}>
      <ConnectionBox />
    </div>
  )
}

export default HelperBox
