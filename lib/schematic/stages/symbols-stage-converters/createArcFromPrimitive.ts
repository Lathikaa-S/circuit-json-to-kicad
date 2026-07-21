import {
  Stroke,
  SymbolArc,
  SymbolArcEnd,
  SymbolArcFill,
  SymbolArcMid,
  SymbolArcStart,
} from "kicadts"
import { applyToPoint, type Matrix } from "transformation-matrix"

const pointOnArc = (
  primitive: any,
  angleDegrees: number,
): { x: number; y: number } => {
  const angleRadians = (angleDegrees * Math.PI) / 180
  return {
    x: primitive.x + primitive.radius * Math.cos(angleRadians),
    y: primitive.y + primitive.radius * Math.sin(angleRadians),
  }
}

export function createArcFromPrimitive({
  primitive,
  transform,
  scale,
}: {
  primitive: any
  transform: Matrix
  scale: number
}): SymbolArc {
  const startAngle = primitive.startAngleDegrees
  const endAngle = primitive.endAngleDegrees
  const counterclockwiseSweep = (((endAngle - startAngle) % 360) + 360) % 360
  const clockwiseSweep = -((((startAngle - endAngle) % 360) + 360) % 360)
  const sweep =
    primitive.direction === "clockwise" ? clockwiseSweep : counterclockwiseSweep
  const midAngle = startAngle + sweep / 2

  const start = applyToPoint(transform, pointOnArc(primitive, startAngle))
  const mid = applyToPoint(transform, pointOnArc(primitive, midAngle))
  const end = applyToPoint(transform, pointOnArc(primitive, endAngle))

  const arc = new SymbolArc() as any
  arc._sxStart = new SymbolArcStart(start.x, start.y)
  arc._sxMid = new SymbolArcMid(mid.x, mid.y)
  arc._sxEnd = new SymbolArcEnd(end.x, end.y)

  const stroke = new Stroke()
  stroke.width = (primitive.strokeWidth ?? 0.05) * scale
  stroke.type = "default"
  arc._sxStroke = stroke

  const fill = new SymbolArcFill()
  fill.type = "none"
  arc._sxFill = fill

  return arc
}
