import { Content } from 'src/types/filedata'
import classes from '../CodeArea.module.css'
import bulbOff from '@renderer/assets/bulb-turned-off.png'
import bulbOn from '@renderer/assets/bulb-turned-on.png'
import { calculatePos } from './utils/calculatePos'

const ChipOutputs = ({ chip }: { chip: Content }) => {
 
    if (chip.name === 'bulb') {
    return (
      <div className={classes['chip-outputs']}>
        {/* outputs */}
        {/* for bulb there is no outpts */}
        <img
          className={classes['bulb-img']}
          alt={`${chip.status === 'off' ? 'bulb-turned-off' : 'bulb-turned-on'}`}
          src={`${chip.status === 'off' ? bulbOff : bulbOn}`}
        />
      </div>
    )
  }

  return (
    <div className={classes['chip-outputs']}>
      {/* outputs */}
      {Array.from({ length: chip.outputs }, (_, i) => (
        <div key={i + '-out-' + chip.id} style={calculatePos(i, 'out')}></div>
      ))}
    </div>
  )
}
export default ChipOutputs
