import { DraggableData, DraggableEvent } from 'react-draggable'
import { Content } from 'src/types/filedata'

export type GateProps = {
  chip: Content
  handleDrag: (e: DraggableEvent, data: DraggableData, chipId: number) => void
}
