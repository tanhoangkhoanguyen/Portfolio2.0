import { useEffect, useRef } from "react"
import { useTheme } from "../../context/theme"
import { prefersReducedMotion } from "../../hooks/usePrefersReducedMotion"

/* ─────────────────────────── Night sky (canvas) ─────────────────────────── */

/** Stellar colors by temperature, hot blue-white → cool orange; weighted toward white like a real sky. */
const STAR_COLORS = ["#9bb0ff", "#aabfff", "#cad7ff", "#f8f7ff", "#fff4ea", "#ffd2a1", "#ffcc6f"]
const COLOR_WEIGHTS = [0.05, 0.1, 0.2, 0.36, 0.17, 0.08, 0.04]
/** Tilt and center of the Milky Way band (relative to the viewport). */
const BAND = { angle: -0.38, cx: 0.56, cy: 0.4 }
const WRAP = 40

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const gaussian = (rand) => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand())

function pickColor(rand) {
  let r = rand()
  for (let i = 0; i < COLOR_WEIGHTS.length; i++) {
    r -= COLOR_WEIGHTS[i]
    if (r <= 0) return i
  }
  return 3
}

const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`
}

/** Pre-rendered glow for bright stars; the brightest also get faint diffraction spikes. */
function glowSprite(color, spikes) {
  const size = 64
  const mid = size / 2
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const g = canvas.getContext("2d")
  const halo = g.createRadialGradient(mid, mid, 0, mid, mid, mid)
  halo.addColorStop(0, "rgba(255,255,255,1)")
  halo.addColorStop(0.07, rgba(color, 1))
  halo.addColorStop(0.22, rgba(color, 0.22))
  halo.addColorStop(1, rgba(color, 0))
  g.fillStyle = halo
  g.fillRect(0, 0, size, size)
  if (spikes) {
    g.globalCompositeOperation = "lighter"
    for (const horizontal of [true, false]) {
      const line = horizontal ? g.createLinearGradient(0, mid, size, mid) : g.createLinearGradient(mid, 0, mid, size)
      line.addColorStop(0, rgba(color, 0))
      line.addColorStop(0.5, "rgba(255,255,255,0.65)")
      line.addColorStop(1, rgba(color, 0))
      g.fillStyle = line
      if (horizontal) g.fillRect(0, mid - 0.6, size, 1.2)
      else g.fillRect(mid - 0.6, 0, 1.2, size)
    }
  }
  return canvas
}

function buildStars(w, h) {
  const rand = mulberry32(1507)
  const stars = []
  const field = Math.min(1100, Math.round((w * h) / 1300))

  for (let i = 0; i < field; i++) {
    const z = 0.15 + Math.pow(rand(), 2.4) * 0.85 // most stars are far away
    const bright = rand() < 0.035
    stars.push({
      x: rand() * (w + WRAP * 2) - WRAP,
      y: rand() * (h + WRAP) - WRAP / 2,
      z,
      r: bright ? 1.1 + rand() * 1.3 : 0.3 + z * 0.75,
      a: bright ? 0.95 : Math.min(1, 0.25 + z * 0.55 + rand() * 0.15),
      color: pickColor(rand),
      speed: 0.4 + rand() * 2.2,
      phase: rand() * Math.PI * 2,
      amp: bright ? 0.3 : 0.1 + rand() * 0.25,
      bright,
      spikes: bright && rand() < 0.35,
    })
  }

  // Milky Way: a dense ridge of faint, far stars along a tilted gaussian band
  const len = Math.hypot(w, h)
  const cos = Math.cos(BAND.angle)
  const sin = Math.sin(BAND.angle)
  for (let i = 0; i < field; i++) {
    const u = (rand() - 0.5) * len * 1.1
    const v = gaussian(rand) * h * 0.075
    const x = w * BAND.cx + u * cos - v * sin
    const y = h * BAND.cy + u * sin + v * cos
    if (x < -WRAP || x > w + WRAP || y < -WRAP || y > h + WRAP) continue
    stars.push({
      x,
      y,
      z: 0.12 + rand() * 0.2,
      r: 0.3 + rand() * 0.35,
      a: 0.2 + rand() * 0.35,
      color: pickColor(rand),
      speed: 0.5 + rand() * 1.5,
      phase: rand() * Math.PI * 2,
      amp: 0.15,
      bright: false,
    })
  }

  return stars.sort((a, b) => a.color - b.color) // batch fillStyle changes
}

/** Static Milky Way glow + dust lanes, painted once per resize onto its own canvas. */
function paintNebula(canvas, w, h, dpr) {
  const pad = 30
  canvas.width = (w + pad * 2) * dpr
  canvas.height = (h + pad * 2) * dpr
  canvas.style.width = `${w + pad * 2}px`
  canvas.style.height = `${h + pad * 2}px`

  const ctx = canvas.getContext("2d")
  const rand = mulberry32(42)
  const len = Math.hypot(w, h)
  const blob = (x, y, rx, ry, color, alpha) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(1, ry / rx)
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
    g.addColorStop(0, `rgba(${color},${alpha})`)
    g.addColorStop(0.5, `rgba(${color},${alpha * 0.4})`)
    g.addColorStop(1, `rgba(${color},0)`)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(0, 0, rx, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  ctx.setTransform(dpr, 0, 0, dpr, pad * dpr, pad * dpr)
  ctx.globalCompositeOperation = "lighter"

  // Faint off-band clouds for color
  blob(w * 0.12, h * 0.18, len * 0.32, len * 0.2, "79,70,229", 0.09)
  blob(w * 0.92, h * 0.78, len * 0.3, len * 0.18, "190,24,93", 0.05)

  ctx.save()
  ctx.translate(w * BAND.cx, h * BAND.cy)
  ctx.rotate(BAND.angle)
  const tints = ["99,102,241", "139,92,246", "56,189,248", "236,72,153", "167,139,250"]
  for (let i = 0; i < 26; i++) {
    const rx = (0.06 + rand() * 0.16) * len
    blob((rand() - 0.5) * len * 1.05, gaussian(rand) * h * 0.05, rx, rx * (0.22 + rand() * 0.2), tints[Math.floor(rand() * tints.length)], 0.035 + rand() * 0.06)
  }
  blob(len * 0.1, 0, len * 0.2, len * 0.045, "255,214,170", 0.08) // warm galactic core

  // Dust lanes carve dark rifts through the glow
  ctx.globalCompositeOperation = "destination-out"
  for (let i = 0; i < 14; i++) {
    const rx = (0.05 + rand() * 0.1) * len
    blob((rand() - 0.5) * len * 0.9, gaussian(rand) * h * 0.012, rx, rx * (0.06 + rand() * 0.06), "0,0,0", 0.55)
  }
  ctx.restore()
}

function spawnShootingStar(w, h, t) {
  const angle = Math.PI * (0.62 + Math.random() * 0.16) // heading down-left
  const speed = 900 + Math.random() * 700
  return {
    x: w * (0.3 + Math.random() * 0.75),
    y: h * Math.random() * 0.35 - 20,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    len: 140 + Math.random() * 160,
    life: 0.55 + Math.random() * 0.5,
    t0: t,
  }
}

function spawnSatellite(w, h, t) {
  const fromLeft = Math.random() < 0.5
  const speed = 26 + Math.random() * 18
  const y = h * (0.08 + Math.random() * 0.4)
  return {
    x: fromLeft ? -10 : w + 10,
    y,
    vx: fromLeft ? speed : -speed,
    vy: speed * (Math.random() * 0.3 - 0.15),
    t0: t,
    phase: Math.random() * 10,
  }
}

/* ───── Planet: a night-side limb, back-lit by cold light ───── */

/** A huge circle whose top just clears the bottom of the screen; the light peaks on its rim, right of the apex. */
function planetGeometry(w, h) {
  const R = Math.max(w * 1.7, h * 1.3)
  const cx = w * 0.4
  const cy = h * (h <= 820 ? 0.87 : 0.81) + R
  const lightX = w * 0.52
  const lightY = cy - Math.sqrt(R * R - (lightX - cx) ** 2)
  return { R, cx, cy, lightX, lightY }
}

function sizeCanvas(canvas, w, h, dpr) {
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  const ctx = canvas.getContext("2d")
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

/** Radial glow squashed vertically by `squash`. */
function glow(ctx, x, y, r, squash, stops) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(1, squash)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
  for (const [at, color] of stops) g.addColorStop(at, color)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

/**
 * One layer of atmosphere: a shell `thickness` px thick hugging the limb (`stops` are [px above the limb, color]),
 * faded with distance from the light (`mask` over `reach` px), so the rim is brightest there and thins out at the edges.
 */
function atmosphereShell(target, geo, w, h, dpr, { thickness, stops, reach, mask }) {
  const layer = document.createElement("canvas")
  const ctx = sizeCanvas(layer, w, h, dpr)
  const shell = ctx.createRadialGradient(geo.cx, geo.cy, geo.R - 2, geo.cx, geo.cy, geo.R + thickness)
  for (const [px, color] of stops) shell.addColorStop((px + 2) / (thickness + 2), color)
  ctx.fillStyle = shell
  ctx.fillRect(0, 0, w, h)

  ctx.globalCompositeOperation = "destination-in"
  const fade = ctx.createRadialGradient(geo.lightX, geo.lightY, 0, geo.lightX, geo.lightY, reach)
  for (const [at, alpha] of mask) fade.addColorStop(at, `rgba(0,0,0,${alpha})`)
  ctx.fillStyle = fade
  ctx.fillRect(0, 0, w, h)

  target.drawImage(layer, 0, 0, w, h)
}

/** Hash-based 2D value noise in [0, 1]. */
function hash2(x, y) {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296
}

function noise2(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const fx = x - xi
  const fy = y - yi
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)
  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

function fbm(x, y, octaves) {
  let sum = 0
  let amp = 0.5
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise2(x, y)
    norm += amp
    amp *= 0.5
    x = x * 2.03 + 17.1
    y = y * 2.03 + 3.7
  }
  return sum / norm
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * Shades the visible cap pixel by pixel, like a tiny fragment shader: oceans, land and cloud from noise
 * (squeezed toward the limb for perspective), lit from behind so only a band near the rim glows blue,
 * with faint city lights on the dark side further down.
 */
function paintSurface(target, { R, cx, cy, lightX }, w, h) {
  const top = Math.floor(cy - R)
  const rows = h - top
  const layer = document.createElement("canvas")
  layer.width = w
  layer.height = rows
  const ctx = layer.getContext("2d")
  const img = ctx.createImageData(w, rows)
  const data = img.data
  const fall = h * 0.055

  for (let j = 0; j < rows; j++) {
    const py = top + j + 0.5
    for (let i = 0; i < w; i++) {
      const px = i + 0.5
      const dx = px - cx
      const dy = cy - py
      const depth = R - Math.sqrt(dx * dx + dy * dy) // px below the limb
      if (depth < -1) continue

      const along = Math.atan2(dx, dy) * R // arc length, so features follow the curve
      const fore = Math.sqrt(Math.max(depth, 0)) * 9 // foreshortening: features crowd toward the limb
      const land = smooth(0.5, 0.6, fbm(along / 160, fore / 55, 5))
      const cloud = smooth(0.55, 0.85, fbm(along / 55 + 31, fore / 20 + 7, 5))
      const detail = 0.7 + 0.6 * fbm(along / 12, fore / 5, 3)

      const lateral = 0.28 + 0.72 * Math.exp(-(((px - lightX) / (w * 0.42)) ** 2))
      const light = lateral * Math.exp(-depth / fall)

      // albedo: deep ocean → slate land → pale cloud
      let r = 8 + land * 18
      let g = 30 + land * 14
      let b = 72 - land * 18
      r += (170 - r) * cloud * 0.45
      g += (195 - g) * cloud * 0.45
      b += (225 - b) * cloud * 0.45

      const lit = (0.05 + 1.9 * light) * detail
      r = r * lit * 0.72
      g = g * lit * 0.9
      b = b * lit

      // atmosphere seen edge-on: a cold glow hugging the rim
      const rim = Math.exp(-Math.max(depth, 0) / 7) * (0.35 + 0.65 * lateral)
      r += 120 * rim
      g += 185 * rim
      b += 255 * rim

      // city lights on the night side
      const night = 1 - smooth(0.03, 0.18, light)
      if (night > 0 && land > 0.6) {
        const spark = noise2(along / 2.6, fore / 1.3)
        if (spark > 0.8) {
          const k = (spark - 0.8) * 5 * night * smooth(0.45, 0.7, fbm(along / 40 + 5, fore / 16, 2)) * 0.8
          r += 255 * k
          g += 214 * k
          b += 160 * k
        }
      }

      const o = (j * w + i) * 4
      data[o] = r
      data[o + 1] = g
      data[o + 2] = b
      data[o + 3] = Math.min(1, depth + 1) * 255 // anti-aliased limb
    }
  }
  ctx.putImageData(img, 0, 0)
  target.drawImage(layer, 0, top, w, rows)
}

function paintPlanet(canvas, w, h, dpr) {
  const ctx = sizeCanvas(canvas, w, h, dpr)
  const geo = planetGeometry(w, h)
  const { lightX, lightY } = geo
  const span = Math.hypot(w, h)
  const haze = Math.max(34, h * 0.05)

  // Deep blue haze around the planet, as in long-exposure orbit shots
  ctx.globalCompositeOperation = "lighter"
  glow(ctx, lightX, lightY, span * 0.62, 0.36, [[0, "rgba(40,120,230,0.2)"], [0.35, "rgba(30,85,200,0.08)"], [1, "rgba(20,50,160,0)"]])

  ctx.globalCompositeOperation = "source-over"
  paintSurface(ctx, geo, w, h)

  ctx.globalCompositeOperation = "lighter"
  // Blue scattering: wide and soft, wraps the whole horizon
  atmosphereShell(ctx, geo, w, h, dpr, {
    thickness: haze,
    stops: [[-2, "rgba(80,150,255,0)"], [0, "rgba(130,190,255,0.85)"], [3, "rgba(80,150,255,0.55)"], [14, "rgba(45,110,235,0.22)"], [haze, "rgba(25,70,200,0)"]],
    reach: span * 0.85,
    mask: [[0, 1], [0.3, 0.75], [1, 0.3]],
  })
  // The bright rim itself
  atmosphereShell(ctx, geo, w, h, dpr, {
    thickness: 6,
    stops: [[-2, "rgba(210,228,255,0)"], [0, "rgba(220,234,255,0.95)"], [2, "rgba(160,200,255,0.6)"], [6, "rgba(120,165,255,0)"]],
    reach: span * 0.65,
    mask: [[0, 1], [0.25, 0.7], [1, 0.22]],
  })
}

/** Soft cold light where the rim peaks: no sun disk, just bloom and a faint streak. On its own canvas so it can breathe. */
function paintHorizonLight(canvas, w, h, dpr) {
  const ctx = sizeCanvas(canvas, w, h, dpr)
  const { lightX, lightY } = planetGeometry(w, h)
  ctx.globalCompositeOperation = "lighter"
  glow(ctx, lightX, lightY, w * 0.3, 0.32, [[0, "rgba(165,195,255,0.16)"], [0.45, "rgba(110,145,255,0.05)"], [1, "rgba(90,120,255,0)"]])
  glow(ctx, lightX, lightY, w * 0.36, 0.012, [[0, "rgba(200,220,255,0.38)"], [0.5, "rgba(140,175,255,0.08)"], [1, "rgba(120,160,255,0)"]])
  glow(ctx, lightX, lightY, 90, 0.55, [[0, "rgba(225,235,255,0.5)"], [0.3, "rgba(170,200,255,0.18)"], [1, "rgba(130,165,255,0)"]])
}

function NightSky({ active }) {
  const starsRef = useRef(null)
  const nebulaRef = useRef(null)
  const planetRef = useRef(null)
  const lightRef = useRef(null)

  useEffect(() => {
    // Hidden behind the day theme: keep the last frame for the cross-fade, skip all work
    if (!active) return undefined
    const canvas = starsRef.current
    const ctx = canvas.getContext("2d")
    const reduced = prefersReducedMotion()
    const sprites = STAR_COLORS.map((c) => ({ glow: glowSprite(c, false), spiky: glowSprite(c, true) }))
    const white = glowSprite("#ffffff", false)

    let w = 0
    let h = 0
    let dpr = 1
    let stars = []
    let shots = []
    let satellite = null
    let nextShot = 2.5
    let nextSatellite = 9
    let frame = 0
    let resizeTimer = 0
    const start = performance.now()

    const draw = (t) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      let fill = -1

      for (const s of stars) {
        const { x, y } = s
        ctx.globalAlpha = s.a * (1 - s.amp + s.amp * Math.sin(t * s.speed + s.phase))
        if (s.bright) {
          const size = s.r * 9
          ctx.drawImage(s.spikes ? sprites[s.color].spiky : sprites[s.color].glow, x - size / 2, y - size / 2, size, size)
        } else {
          if (s.color !== fill) {
            ctx.fillStyle = STAR_COLORS[s.color]
            fill = s.color
          }
          ctx.fillRect(x - s.r, y - s.r, s.r * 2, s.r * 2)
        }
      }

      if (reduced) return

      if (t > nextShot) {
        shots.push(spawnShootingStar(w, h, t))
        nextShot = t + 3.5 + Math.random() * 7
      }
      shots = shots.filter((s) => t - s.t0 < s.life)
      ctx.lineCap = "round"
      for (const s of shots) {
        const age = t - s.t0
        const k = age / s.life
        const hx = s.x + s.vx * age
        const hy = s.y + s.vy * age
        const speed = Math.hypot(s.vx, s.vy)
        const tail = s.len * Math.min(1, k * 3)
        const fade = Math.sin(Math.PI * k)
        const grad = ctx.createLinearGradient(hx, hy, hx - (s.vx / speed) * tail, hy - (s.vy / speed) * tail)
        grad.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`)
        grad.addColorStop(0.3, `rgba(199,210,254,${0.4 * fade})`)
        grad.addColorStop(1, "rgba(165,180,252,0)")
        ctx.globalAlpha = 1
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(hx, hy)
        ctx.lineTo(hx - (s.vx / speed) * tail, hy - (s.vy / speed) * tail)
        ctx.stroke()
        ctx.globalAlpha = fade
        ctx.drawImage(white, hx - 7, hy - 7, 14, 14)
      }

      // A satellite occasionally glides across, with the odd sun glint
      if (!satellite && t > nextSatellite) satellite = spawnSatellite(w, h, t)
      if (satellite) {
        const age = t - satellite.t0
        const x = satellite.x + satellite.vx * age
        const y = satellite.y + satellite.vy * age
        if (x < -20 || x > w + 20) {
          satellite = null
          nextSatellite = t + 16 + Math.random() * 20
        } else {
          const glint = Math.max(0, Math.sin((age + satellite.phase) * 0.9)) ** 24
          ctx.globalAlpha = 0.5 + glint * 0.5
          ctx.fillStyle = "#e5e7ff"
          ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6)
          if (glint > 0.05) ctx.drawImage(white, x - 6, y - 6, 12, 12)
        }
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      stars = buildStars(w, h)
      paintNebula(nebulaRef.current, w, h, dpr)
      paintPlanet(planetRef.current, w, h, dpr)
      paintHorizonLight(lightRef.current, w, h, dpr)
      draw((performance.now() - start) / 1000)
    }

    const loop = (now) => {
      draw((now - start) / 1000)
      frame = requestAnimationFrame(loop)
    }

    // The planet is shaded per pixel (~100ms), so repaint once the window stops resizing, not on every event
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }

    resize()
    window.addEventListener("resize", onResize)
    if (!reduced) frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", onResize)
    }
  }, [active])

  return (
    <>
      <div className="space-base absolute inset-0" />
      <canvas ref={nebulaRef} className="nebula-canvas" />
      <canvas ref={starsRef} className="absolute inset-0" />
      <canvas ref={planetRef} className="absolute inset-0" />
      <canvas ref={lightRef} className="horizon-light absolute inset-0" />
    </>
  )
}

/* ─────────────────────────── Daylight (Sonoma-style) ─────────────────────────── */

const HILL_PERIOD = 1440

/** Wave layers, back to front: `waves` are [amplitude, harmonic, phase]; `drift` is seconds per period (nearer = faster). */
const HILLS = [
  { base: 160, waves: [[30, 1, 0.4], [16, 2, 2.1], [6, 3, 0.9]], from: "#dbe4ff", to: "#c7d2fe", opacity: 0.6, drift: 130 },
  { base: 232, waves: [[26, 1, 2.6], [14, 2, 0.3], [5, 4, 1.2]], from: "#c7d2fe", to: "#a5b4fc", opacity: 0.6, drift: 100 },
  { base: 292, waves: [[20, 1, 4.1], [11, 2, 1.4], [4, 3, 2.8]], from: "#a5b4fc", to: "#818cf8", opacity: 0.55, drift: 78 },
  { base: 350, waves: [[14, 1, 1.0], [8, 2, 3.3], [3, 5, 0.4]], from: "#818cf8", to: "#6366f1", opacity: 0.5, drift: 60 },
]

/** Two periods wide, so sliding it left by one period (50%) loops seamlessly. */
function wavePath({ base, waves }) {
  let d = ""
  for (let x = 0; x <= HILL_PERIOD * 2; x += 12) {
    const y = waves.reduce((sum, [amp, k, phase]) => sum + amp * Math.sin((2 * Math.PI * k * x) / HILL_PERIOD + phase), base)
    d += `${x ? "L" : "M"}${x} ${y.toFixed(1)}`
  }
  return `${d}V400H0Z`
}

const HILL_PATHS = HILLS.map(wavePath)

function DaySky() {
  return (
    <>
      <div className="dawn-base absolute inset-0" />
      <div className="dawn-sun" />
      <div className="dawn-cloud left-[-8%] top-[6%] h-[40vh] w-[55vw] bg-white/55" />
      <div className="dawn-cloud left-[30%] top-[30%] h-[30vh] w-[40vw] bg-indigo-100/50 [animation-delay:-12s]" />
      <div className="dawn-cloud right-[-10%] top-[42%] h-[34vh] w-[46vw] bg-sky-200/50 [animation-delay:-22s]" />
      <svg className="dawn-hills" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <defs>
          {HILLS.map((hill, i) => (
            <linearGradient key={i} id={`hill-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={hill.from} />
              <stop offset="1" stopColor={hill.to} />
            </linearGradient>
          ))}
        </defs>
        {HILLS.map((hill, i) => (
          <path
            key={i}
            className="dawn-hill"
            d={HILL_PATHS[i]}
            fill={`url(#hill-${i})`}
            fillOpacity={hill.opacity}
            style={{ animationDuration: `${hill.drift}s` }}
          />
        ))}
      </svg>
    </>
  )
}

export function Wallpaper() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className={`wallpaper-layer ${isDark ? "opacity-0" : "opacity-100"}`} data-hidden={isDark}>
        <DaySky />
      </div>
      <div className={`wallpaper-layer ${isDark ? "opacity-100" : "opacity-0"}`} data-hidden={!isDark}>
        <NightSky active={isDark} />
      </div>
      <div className="grain" />
    </div>
  )
}
