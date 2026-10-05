export const MENU_BAR_H = 30
export const COMPACT_QUERY = "(max-width: 767px)"

const clamp = (v, min, max) => Math.min(Math.max(v, min), Math.max(min, max))

/** Area windows may occupy. */
export function getBounds(compact) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  if (compact) return { left: 6, top: MENU_BAR_H + 6, right: vw - 6, bottom: vh - 6 }
  return { left: 14, top: MENU_BAR_H + 12, right: vw - 14, bottom: vh - 14 }
}

export const maximizedRect = (b) => ({ x: b.left, y: b.top, w: b.right - b.left, h: b.bottom - b.top })

/** Shrinks and nudges a window so it sits fully inside the bounds. */
export function fitRect({ x, y, w, h }, b) {
  const fw = Math.min(w, b.right - b.left)
  const fh = Math.min(h, b.bottom - b.top)
  return { w: fw, h: fh, x: clamp(x, b.left, b.right - fw), y: clamp(y, b.top, b.bottom - fh) }
}

/** Lenient clamp while dragging: the window may hang off an edge, but its title bar stays grabbable. */
export function dragRect(rect, b) {
  return {
    ...rect,
    x: clamp(rect.x, b.left - rect.w + 140, b.right - 140),
    y: clamp(rect.y, b.top, b.bottom - 44),
  }
}

/** Centered, then cascaded so stacked windows don't hide each other. */
export function initialRect(size, b, index) {
  const bw = b.right - b.left
  const bh = b.bottom - b.top
  const w = Math.min(size.w, bw - 24)
  const h = Math.min(size.h, bh - 12)
  const cascade = (index % 5) * 30
  return fitRect({ w, h, x: b.left + (bw - w) / 2 + cascade, y: b.top + Math.max(0, (bh - h) / 2 - 8) + cascade }, b)
}
