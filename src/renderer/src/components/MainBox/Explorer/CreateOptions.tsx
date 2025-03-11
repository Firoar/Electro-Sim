import classes from './Explorer.module.css'
import CreateFile from './Explorer_Options/CreateFile'
import CreateFolder from './Explorer_Options/CreateFolder'
import RefreshFiles from './Explorer_Options/RefreshFiles'

const CreateOptions = () => {
  return (
    <div className={classes['create-file']}>
      <CreateFile />
      <CreateFolder />
      <RefreshFiles />
    </div>
  )
}
export default CreateOptions
