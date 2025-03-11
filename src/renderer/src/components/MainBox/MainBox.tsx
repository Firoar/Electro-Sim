import Explorer from './Explorer/Explorer'
import classes from './MainBox.module.css'
import WorkArea from './WorkArea/WorkArea'
import Options from './Options/Options'

const MainBox = () => {
  return (
    <div className={classes['mainbox-main-div']}>
      <Explorer />
      <WorkArea />
      <Options />
    </div>
  )
}
export default MainBox
