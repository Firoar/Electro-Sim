import { useSelector } from 'react-redux'
import classes from './CodeArea.module.css'
import ErrorInOpening from '../ErrorInOpening'
import ChipsBar from './ChipsBar'
import ComponentArrange from './ComponentArrange/ComponentArrange'
import { RootState } from '@renderer/store/store'
import HelperBox from './helperBox/HelperBox'

const CodeSpace = () => {
  const { selectedFile } = useSelector((state: RootState) => state.fileExplorer)

  return (
    <div className={classes['code-space']}>
      {!selectedFile.endsWith('.chip') ? (
        <ErrorInOpening />
      ) : (
        <>
          <ChipsBar />
          <div className={classes['jod-box']}>
            <HelperBox />
            <ComponentArrange />
          </div>
        </>
      )}
    </div>
  )
}
export default CodeSpace
