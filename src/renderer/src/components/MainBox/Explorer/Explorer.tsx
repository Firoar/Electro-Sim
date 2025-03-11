import AllFiles from './AllFiles'
import CreateOptions from './CreateOptions'
import classes from './Explorer.module.css'

const Explorer = () => {
  return (
    <div className={classes['explorer-main-div']}>
      <CreateOptions />
      <AllFiles />
    </div>
  )
}

export default Explorer
