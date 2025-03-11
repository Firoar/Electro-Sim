import { RootState } from 'public/renderer/src/store/store'
import { useSelector } from 'react-redux'
import classes from './CodeArea.module.css'
import ErrorInOpening from '../ErrorInOpening'
import ChipsBar from './ChipsBar'
import ComponentArrange from './ComponentArrange/ComponentArrange'

const CodeSpace = () => {
  const { selectedFile } = useSelector((state: RootState) => state.fileExplorer)

  return (
    <div className={classes['code-space']}>
      {!selectedFile.endsWith('.chip') ? (
        <ErrorInOpening />
      ) : (
        <>
          <ChipsBar />
          <ComponentArrange />
        </>
      )}
    </div>
  )
}
export default CodeSpace
