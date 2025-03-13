import ChipInputs from './ChipInputs'
import ChipOutputs from './ChipOutputs'
import classes from '../CodeArea.module.css'
import { Content } from 'src/types/filedata'

const ChipBody = ({ chip }: { chip: Content }) => {
  return (
    <div className={classes['chip-body']}>
      <ChipInputs chip={chip} />
      <ChipOutputs chip={chip} />
    </div>
  )
}
export default ChipBody
