import { useSelector } from 'react-redux'
import classes from './WorkArea.module.css'
import { RootState } from 'renderer/src/store/store'
import TabBar from './TabBar'
import CodeSpace from './CodeSpace/MainCodeSpace'

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
