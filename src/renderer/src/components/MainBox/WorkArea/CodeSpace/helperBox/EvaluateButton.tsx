import { useDispatch, useSelector } from 'react-redux'
import classes from './helperBox.module.css'
import { RootState } from '@renderer/store/store'
import { toggleBulbs } from '@renderer/store/features/chips/chipSlice'

const EvaluateButton = () => {
  const { chipContents } = useSelector((state: RootState) => state.chips)
  const dispatch = useDispatch()
  const { selectedFile, cwd } = useSelector((state: RootState) => state.fileExplorer)

  const handleEvaluateBtnClicked = async () => {
    const name = selectedFile.split('/').pop()?.split('.chip')[0] || 'random'
    const result = await window.electron.evaluateChip(name, chipContents)
    if ('error' in result) {
      alert('error...')
      console.log(result.error)
    } else if ('class' in result) {
      console.log(result.class)
      const res = await window.electron.saveCompileFiles(cwd, selectedFile, result.class)
      if ('error' in res) {
        console.log(res)
      } else {
        const r = await window.electron.getOutputsOfChip(res.path, result.inputs)
        if ('error' in r) {
          console.log('error : ', r)
        } else {
          dispatch(toggleBulbs(Object.fromEntries(r.outputs)))
        }
      }
    }
  }

  return (
    <div className={classes['evaluate-btn-box']}>
      <button onClick={handleEvaluateBtnClicked}>Evaluate </button>
    </div>
  )
}
export default EvaluateButton
