import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { useMediaQuery } from "../hooks/useMediaQuery"
import { APP_BY_ID } from "./apps"
import { OSContext } from "./context"
import { COMPACT_QUERY, fitRect, getBounds, initialRect } from "./layout"

/**
 * Window lifecycle: opening → open ⇄ minimizing → minimized → restoring → open, and any → closing → removed.
 * `windows` keeps a stable order (so React never moves DOM nodes and inputs keep focus);
 * `stack` holds the z-order, topmost last.
 */
const VISIBLE = new Set(["opening", "open", "restoring"])

const raise = (stack, id) => [...stack.filter((x) => x !== id), id]

function reducer(state, action) {
  const { windows, stack } = state
  const update = (fn) => ({ ...state, windows: windows.map((w) => (w.id === action.id ? { ...w, ...fn(w) } : w)) })
  const drop = (id) => ({ windows: windows.filter((w) => w.id !== id), stack: stack.filter((x) => x !== id) })

  switch (action.type) {
    case "open": {
      const existing = windows.find((w) => w.id === action.id)
      if (!existing) {
        const win = { id: action.id, status: "opening", maximized: false, rect: action.rect, origin: action.origin }
        return { windows: [...windows, win], stack: raise(stack, action.id) }
      }
      const hidden = existing.status === "minimized" || existing.status === "minimizing"
      const status = hidden ? "restoring" : existing.status === "closing" ? "open" : existing.status
      return {
        windows: windows.map((w) => (w === existing ? { ...w, status, origin: action.origin ?? w.origin } : w)),
        stack: raise(stack, action.id),
      }
    }
    case "focus":
      return stack[stack.length - 1] === action.id ? state : { ...state, stack: raise(stack, action.id) }
    // An animation finished: only advance if nothing changed the status in the meantime
    case "settle":
      return update((w) => (w.status === action.from ? { status: action.to } : {}))
    case "close": {
      const win = windows.find((w) => w.id === action.id)
      if (!win) return state
      return win.status === "minimized" ? drop(action.id) : update(() => ({ status: "closing" }))
    }
    case "remove": {
      const win = windows.find((w) => w.id === action.id)
      return win?.status === "closing" ? drop(action.id) : state
    }
    case "minimize":
      return update((w) => (VISIBLE.has(w.status) ? { status: "minimizing" } : {}))
    case "maximize":
      return update((w) => ({ maximized: !w.maximized }))
    case "move":
      return update(() => ({ rect: action.rect }))
    case "fit":
      return { ...state, windows: windows.map((w) => ({ ...w, rect: fitRect(w.rect, action.bounds) })) }
    case "closeAll": {
      const kept = windows.filter((w) => w.status !== "minimized").map((w) => ({ ...w, status: "closing" }))
      return { windows: kept, stack: stack.filter((id) => kept.some((w) => w.id === id)) }
    }
    default:
      return state
  }
}

const rectOf = (el) => {
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height }
}

const isTyping = (el) => el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

export function OSProvider({ children }) {
  const [{ windows, stack }, dispatch] = useReducer(reducer, { windows: [], stack: [] })
  const isCompact = useMediaQuery(COMPACT_QUERY)
  const [bounds, setBounds] = useState(() => getBounds(isCompact))

  const windowsRef = useRef(windows)
  const boundsRef = useRef(bounds)
  useEffect(() => {
    windowsRef.current = windows
    boundsRef.current = bounds
  })

  // Keep windows on screen when the viewport changes
  useEffect(() => {
    const update = () => {
      const next = getBounds(isCompact)
      setBounds(next)
      dispatch({ type: "fit", bounds: next })
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [isCompact])

  const openApp = useCallback((id, originEl) => {
    const app = APP_BY_ID[id]
    if (!app) return
    const live = windowsRef.current.filter((w) => w.status !== "closing").length
    dispatch({
      type: "open",
      id,
      origin: originEl ? rectOf(originEl) : null,
      rect: initialRect(app.size, boundsRef.current, live),
    })
  }, [])

  const actions = useMemo(
    () => ({
      openApp,
      closeApp: (id) => dispatch({ type: "close", id }),
      minimizeApp: (id) => dispatch({ type: "minimize", id }),
      focusApp: (id) => dispatch({ type: "focus", id }),
      toggleMaximize: (id) => dispatch({ type: "maximize", id }),
      moveWindow: (id, rect) => dispatch({ type: "move", id, rect }),
      settleWindow: (id, from, to) => dispatch({ type: "settle", id, from, to }),
      removeWindow: (id) => dispatch({ type: "remove", id }),
      closeAll: () => dispatch({ type: "closeAll" }),
    }),
    [openApp]
  )

  const focusedId = useMemo(() => {
    for (let i = stack.length - 1; i >= 0; i--) {
      const win = windows.find((w) => w.id === stack[i])
      if (win && VISIBLE.has(win.status)) return win.id
    }
    return null
  }, [windows, stack])

  // Esc closes the focused window (unless the user is typing)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && focusedId && !isTyping(e.target)) {
        dispatch({ type: "close", id: focusedId })
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [focusedId])

  // Mirror the focused app in the URL so a link like /#projects opens straight into it
  const hasOpened = useRef(false)
  useEffect(() => {
    if (focusedId) hasOpened.current = true
    if (!hasOpened.current) return
    const { pathname, search } = window.location
    window.history.replaceState(null, "", focusedId ? `#${focusedId}` : pathname + search)
  }, [focusedId])

  const value = useMemo(
    () => ({ ...actions, windows, stack, focusedId, isCompact, bounds }),
    [actions, windows, stack, focusedId, isCompact, bounds]
  )

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>
}
