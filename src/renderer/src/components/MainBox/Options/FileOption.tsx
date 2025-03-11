import classes from './Options.module.css'
import clsx from 'clsx'

const FileOption = () => {
  const fileOptions = ['New Text File', 'New Folder', 'Open Folder', 'Save']
  return (
    <div className={clsx(classes['option-div'], classes['file-option-div'])}>
      {fileOptions.map((option, id) => (
        <div
          role="button"
          tabIndex={0}
          className={clsx(classes['file-single-option'])}
          key={option + id}
        >
          {option}
        </div>
      ))}
    </div>
  )
}
export default FileOption
