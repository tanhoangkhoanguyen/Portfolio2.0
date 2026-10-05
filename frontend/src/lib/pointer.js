/** Smoothed, normalized (-1…1) pointer position shared by every parallax layer. */
const pointer = { x: 0, y: 0 }
const target = { x: 0, y: 0 }
const listeners = new Set()
let frame = 0
let bound = false

function tick() {
  pointer.x += (target.x - pointer.x) * 0.075
  pointer.y += (target.y - pointer.y) * 0.075
  listeners.forEach((fn) => fn(pointer))
  const settled = Math.abs(target.x - pointer.x) < 0.0005 && Math.abs(target.y - pointer.y) < 0.0005
  frame = settled ? 0 : requestAnimationFrame(tick)
}

function onMove(e) {
  if (e.pointerType === "touch") return
  target.x = (e.clientX / window.innerWidth) * 2 - 1
  target.y = (e.clientY / window.innerHeight) * 2 - 1
  if (!frame) frame = requestAnimationFrame(tick)
}

export function subscribePointer(fn) {
  if (!bound) {
    window.addEventListener("pointermove", onMove, { passive: true })
    bound = true
  }
  listeners.add(fn)
  fn(pointer)
  return () => listeners.delete(fn)
}

export const getPointer = () => pointer
