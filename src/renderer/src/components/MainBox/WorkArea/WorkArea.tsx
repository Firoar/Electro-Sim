import { useSelector } from 'react-redux'
import classes from './WorkArea.module.css'
import TabBar from './TabBar'
import CodeSpace from './CodeSpace/MainCodeSpace'
import { RootState } from '@renderer/store/store'

const WorkArea = () => {
  const { allSelectedFiles } = useSelector((state: RootState) => state.fileExplorer)

  return (
    <div className={classes['workarea-main-div']}>
      {allSelectedFiles.length > 0 ? (
        <>
          <TabBar />
          <CodeSpace />
        </>
      ) : (
        <div className={classes['app-name']}>Electro-Sim</div>
      )}
    </div>
  )
}
export default WorkArea
