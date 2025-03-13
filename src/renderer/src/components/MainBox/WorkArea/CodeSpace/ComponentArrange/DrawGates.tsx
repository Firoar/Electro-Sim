import { DraggableData, DraggableEvent } from 'react-draggable'
import { useDispatch, useSelector } from 'react-redux'
import { setDimensions, updateChipPosition } from '@renderer/store/features/chips/chipSlice'
import { RootState } from '@renderer/store/store'

import { useCallback, useRef } from 'react'
import AllGatesContruction from './AllGatesContruction'

const DraggableBox = () => {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null) // Declare ref

  const dispatch = useDispatch()
  const { chipContents } = useSelector((state: RootState) => state.chips)

  const handleDrag = useCallback((e: DraggableEvent, data: DraggableData, chipId: number) => {
    e
    dispatch(updateChipPosition({ id: chipId, x: data.x, y: data.y }))

    if (debounceTimeout.current !== null) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      dispatch(setDimensions({ x: data.x, y: data.y }))
    }, 200)
  }, [])

  return (
    <>
      {chipContents.map((chip) => (
        <AllGatesContruction key={chip.id} handleDrag={handleDrag} chip={chip} />
      ))}
    </>
  )
}

const DrawGates = () => {
  return <DraggableBox />
}

export default DrawGates
