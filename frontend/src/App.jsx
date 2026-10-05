import { useCallback, useEffect, useState } from "react"
import { Hero } from "./components/Hero"
import { BootScreen } from "./components/os/BootScreen"
import { MenuBar } from "./components/os/MenuBar"
import { Wallpaper } from "./components/os/Wallpaper"
import { Window } from "./components/os/Window"
import { prefersReducedMotion } from "./hooks/usePrefersReducedMotion"
import { APP_BY_ID } from "./os/apps"
import { useOS } from "./os/context"
import { OSProvider } from "./os/OSProvider"

const BOOT_KEY = "portfolio-booted"

function hasBooted() {
  try {
    return sessionStorage.getItem(BOOT_KEY) === "1" || prefersReducedMotion()
  } catch {
    return true
  }
}

function Desktop() {
  const { windows, stack, focusedId, openApp } = useOS()
  const [booted, setBooted] = useState(hasBooted)
  // Read before any window opens (the URL hash is rewritten to track the focused app)
  const [initialApp] = useState(() => window.location.hash.slice(1))

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem(BOOT_KEY, "1")
    } catch {
      // private mode: boot again next time, no harm
    }
    setBooted(true)
  }, [])

  useEffect(() => {
    if (booted && APP_BY_ID[initialApp]) openApp(initialApp)
  }, [booted, initialApp, openApp])

  return (
    <div className="relative h-dvh w-full select-none overflow-hidden text-slate-900 dark:text-white">
      <Wallpaper />
      <MenuBar />
      <Hero ready={booted} />

      {windows.map((win) => (
        <Window key={win.id} win={win} app={APP_BY_ID[win.id]} focused={win.id === focusedId} z={100 + stack.indexOf(win.id)} />
      ))}

      {!booted && <BootScreen onDone={finishBoot} />}
    </div>
  )
}

export function App() {
  return (
    <OSProvider>
      <Desktop />
    </OSProvider>
  )
}
