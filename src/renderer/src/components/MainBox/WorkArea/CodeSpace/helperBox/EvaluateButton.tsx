import { useSelector } from 'react-redux'
import classes from './helperBox.module.css'
import { RootState } from '@renderer/store/store'

const EvaluateButton = () => {
  const { chipContents } = useSelector((state: RootState) => state.chips)
  const { selectedFile } = useSelector((state: RootState) => state.fileExplorer)
  const handleEvaluateBtnClicked = async () => {
    const name = selectedFile.split('/').pop()?.split('.chip')[0] || 'random'
    const result = await window.electron.evaluateChip(name, chipContents)
    if ('error' in result) {
      alert('error...')
      console.log(result.error)
    } else if ('class' in result) {
      console.log(result.class)
    }
  }

  return (
    <div className={classes['evaluate-btn-box']}>
      <button onClick={handleEvaluateBtnClicked}>Evaluate </button>
    </div>
  )
}
export default EvaluateButton
