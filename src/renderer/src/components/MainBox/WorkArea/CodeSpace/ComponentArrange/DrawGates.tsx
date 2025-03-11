import classes from '../CodeArea.module.css'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { useDispatch, useSelector } from 'react-redux'
import { setDimensions, updateChipPosition } from '@renderer/store/features/chips/chipSlice'
import { RootState } from '@renderer/store/store'
import { bulbDim, calculateDim, calculatePos } from './utils/calculatePos'

const DraggableBox = () => {
  const dispatch = useDispatch()
  const { chipContents } = useSelector((state: RootState) => state.chips)
  // const { selectedFile } = useSelector((state: RootState) => state.fileExplorer)

  const handleDrag = (e: DraggableEvent, data: DraggableData, chipId: number) => {
    e
    dispatch(updateChipPosition({ id: chipId, x: data.x, y: data.y }))
    dispatch(setDimensions({ x: data.x, y: data.y }))
  }

  return (
    <>
      {chipContents.map((chip) => {
        if (chip.name === 'bulb') {
          return (
            <Draggable
              key={chip.name + chip.id}
              defaultPosition={{ x: chip.position.x, y: chip.position.y }}
              bounds="parent"
              onDrag={(e, data) => handleDrag(e, data, chip.id)}
            >
              <div style={bulbDim()} className={classes['draggable-box']}>
                <p className={classes['chip-name']}>{chip.name}</p>
                <div className={classes['chip-body']}>
                  <div className={classes['chip-inputs']}>
                    {/* inputs */}

                    {Array.from({ length: chip.inputs }, (_, i) => (
                      <div key={i + '-in-' + chip.id} style={calculatePos(i, 'in')}></div>
                    ))}
                  </div>

                  <div className={classes['chip-outputs']}>
                    {/* outputs */}
                    {/* for bulb there is no outpts */}
                    <img
                      className={classes['bulb-img']}
                      alt={`${chip.status === 'off' ? 'bulb-turned-off' : 'bulb-turned-on'}`}
                      src={`${chip.status === 'off' ? './bulb-turned-off.png' : './bulb-turned-on.png'}`}
                    />
                  </div>
                </div>
              </div>
            </Draggable>
          )
        } else {
          return (
            <Draggable
              key={chip.name + chip.id}
              defaultPosition={{ x: chip.position.x, y: chip.position.y }}
              bounds="parent"
              onDrag={(e, data) => handleDrag(e, data, chip.id)}
            >
              <div
                style={calculateDim(chip.inputs, chip.outputs)}
                className={classes['draggable-box']}
              >
                <p className={classes['chip-name']}>{chip.name}</p>

                {/* Chip contruction below*/}

                <div className={classes['chip-body']}>
                  <div className={classes['chip-inputs']}>
                    {/* inputs */}
                    {Array.from({ length: chip.inputs }, (_, i) => (
                      <div key={i + '-in-' + chip.id} style={calculatePos(i, 'in')}></div>
                    ))}
                  </div>

                  <div className={classes['chip-outputs']}>
                    {/* outputs */}
                    {Array.from({ length: chip.outputs }, (_, i) => (
                      <div key={i + '-out-' + chip.id} style={calculatePos(i, 'out')}></div>
                    ))}
                  </div>
                </div>

                {/*  chip contruction ends here */}
              </div>
            </Draggable>
          )
        }
      })}
    </>
  )
}

const DrawGates = () => {
  return <DraggableBox />
}

export default DrawGates
