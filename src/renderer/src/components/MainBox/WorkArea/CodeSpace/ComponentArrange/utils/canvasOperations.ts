import { Content } from 'src/types/filedata'
import { giveCenterPositionOfInput, giveCenterPositionOfOutput } from './calculatePos'

export const canvasOperations = (
  canvas: HTMLCanvasElement | null,
  wires: Record<string, boolean>,
  chipContents: Content[]
) => {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  Object.entries(wires).forEach(([key, val]) => {
    if (!val) return // Skip if the connection is false

    const [inChipId, inId, outChipId, outId] = key.split('-').map(Number)

    const inChip = chipContents.find((ch) => ch.id === inChipId)
    const outChip = chipContents.find((ch) => ch.id === outChipId)

    if (inChip && outChip) {
      const [x1, y1] = giveCenterPositionOfInput(inChip, inId)
      const [x2, y2] = giveCenterPositionOfOutput(outChip, outId)

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.closePath()

      drawCircle(ctx, x1, y1, 10, 'silver')
      drawCircle(ctx, x2, y2, 10, 'silver')
    }
  })
}

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) => {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
}
