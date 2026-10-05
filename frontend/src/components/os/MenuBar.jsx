import { useEffect, useRef, useState } from "react"
import { useTheme } from "../../context/theme"
import { CONTACT, PROFILE } from "../../data/profile"
import { APPS, APP_BY_ID } from "../../os/apps"
import { useOS } from "../../os/context"
import { Icon } from "../ui/Icon"

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let interval = 0
    // Tick on the minute boundary, like the real menu bar
    const timeout = setTimeout(() => {
      setNow(new Date())
      interval = setInterval(() => setNow(new Date()), 60_000)
    }, 60_000 - (Date.now() % 60_000))
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])
  return now
}

/** Real battery level where the Battery Status API exists (Chromium); hidden elsewhere. */
function Battery() {
  const [battery, setBattery] = useState(null)
  useEffect(() => {
    let bat = null
    let cancelled = false
    const sync = () => !cancelled && setBattery({ level: bat.level, charging: bat.charging })
    navigator.getBattery?.()
      .then((b) => {
        bat = b
        sync()
        b.addEventListener("levelchange", sync)
        b.addEventListener("chargingchange", sync)
      })
      .catch(() => {})
    return () => {
      cancelled = true
      bat?.removeEventListener("levelchange", sync)
      bat?.removeEventListener("chargingchange", sync)
    }
  }, [])

  if (!battery) return null
  const pct = Math.round(battery.level * 100)
  return (
    <span className="hidden items-center gap-1.5 px-1.5 md:flex" title={`Battery ${pct}%${battery.charging ? ", charging" : ""}`}>
      <span className="text-[12px] tabular-nums opacity-90">{pct}%</span>
      <svg viewBox="0 0 27 12" className="h-3 w-[27px]" aria-hidden>
        <rect x=".5" y=".5" width="22.5" height="11" rx="3.2" fill="none" stroke="currentColor" strokeOpacity=".45" />
        <rect x="2" y="2" width={Math.max(1.5, 19.5 * battery.level)} height="8" rx="1.8" fill={battery.level < 0.2 ? "#ef4444" : "currentColor"} />
        <path d="M24.8 4.2v3.6" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round" />
        {battery.charging && <path d="M12.6 2.2 9 6.6h3l-.9 3.4 3.7-4.6h-3z" fill="#fff" stroke="#000" strokeOpacity=".35" strokeWidth=".4" />}
      </svg>
    </span>
  )
}

function WifiGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
      <path d="M2.5 8.8a14 14 0 0 1 19 0M5.8 12.4a9.2 9.2 0 0 1 12.4 0M9.1 15.9a4.4 4.4 0 0 1 5.8 0" />
      <circle cx="12" cy="19.2" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}

function MenuPanel({ items, onClose }) {
  return (
    <div role="menu" className="menu-panel absolute left-0 top-[calc(100%+3px)] min-w-[230px] p-[5px]">
      {items.map((item, i) =>
        item === "sep" ? (
          <div key={`sep-${i}`} role="separator" className="mx-2.5 my-[5px] h-px bg-black/10 dark:bg-white/10" />
        ) : (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              onClose()
              item.onSelect()
            }}
            className="flex w-full items-center justify-between gap-8 rounded-[5px] py-[3px] pl-1.5 pr-2.5 text-left text-[13px] enabled:hover:bg-indigo-500 enabled:hover:text-white disabled:opacity-35"
          >
            <span className="flex items-center gap-1">
              <span className="w-4 text-center text-[11px]">{item.checked ? "✓" : ""}</span>
              {item.label}
            </span>
            {item.shortcut && <kbd className="font-sans text-[12px] opacity-55">{item.shortcut}</kbd>}
          </button>
        )
      )}
    </div>
  )
}

export function MenuBar() {
  const os = useOS()
  const { theme, toggleTheme } = useTheme()
  const now = useClock()
  const barRef = useRef(null)
  const [openMenu, setOpenMenu] = useState(null)

  const isDark = theme === "dark"
  const focusedApp = os.focusedId ? APP_BY_ID[os.focusedId] : null
  const anyOpen = os.windows.some((w) => w.status !== "closing")

  const menus = [
    {
      id: "go",
      label: "Go",
      desktopOnly: true,
      items: APPS.map((app) => ({ label: app.label, checked: app.id === os.focusedId, onSelect: () => os.openApp(app.id) })),
    },
    {
      id: "window",
      label: "Window",
      desktopOnly: true,
      items: [
        { label: "Minimize", disabled: !focusedApp, onSelect: () => os.minimizeApp(os.focusedId) },
        { label: "Zoom", disabled: !focusedApp, onSelect: () => os.toggleMaximize(os.focusedId) },
        "sep",
        { label: "Close All", disabled: !anyOpen, onSelect: os.closeAll },
        ...(os.windows.length
          ? ["sep", ...os.windows.map((w) => ({ label: APP_BY_ID[w.id].label, checked: w.id === os.focusedId, onSelect: () => os.openApp(w.id) }))]
          : []),
      ],
    },
    {
      id: "help",
      label: "Help",
      desktopOnly: true,
      items: [{ label: `Email ${PROFILE.firstName}`, onSelect: () => (window.location.href = `mailto:${CONTACT.email}`) }],
    },
  ].filter((menu) => !(menu.desktopOnly && os.isCompact))

  // Dismiss on outside click / Esc (captured first so Esc doesn't also close a window)
  useEffect(() => {
    if (!openMenu) return undefined
    const onDown = (e) => !barRef.current?.contains(e.target) && setOpenMenu(null)
    const onKey = (e) => {
      if (e.key !== "Escape") return
      e.stopPropagation()
      setOpenMenu(null)
    }
    window.addEventListener("pointerdown", onDown, true)
    window.addEventListener("keydown", onKey, true)
    return () => {
      window.removeEventListener("pointerdown", onDown, true)
      window.removeEventListener("keydown", onKey, true)
    }
  }, [openMenu])

  const date = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
  const time = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })

  return (
    <header ref={barRef} className="menu-bar fixed inset-x-0 top-0 z-[1000] flex h-[30px] select-none items-center justify-between px-1.5 text-[13px] text-slate-900 dark:text-white">
      <nav className="flex min-w-0 items-center" aria-label="Menu bar">
        <span className="whitespace-nowrap px-2.5 font-bold">{PROFILE.fullName}</span>
        {menus.map((menu) => (
          <div key={menu.id} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openMenu === menu.id}
              onClick={() => setOpenMenu((current) => (current === menu.id ? null : menu.id))}
              onPointerEnter={() => openMenu && setOpenMenu(menu.id)}
              className={`menu-trigger flex h-6 items-center whitespace-nowrap rounded-[5px] px-2.5 font-medium ${
                openMenu === menu.id ? "bg-black/10 dark:bg-white/15" : ""
              }`}
            >
              {menu.label}
            </button>
            {openMenu === menu.id && <MenuPanel items={menu.items} onClose={() => setOpenMenu(null)} />}
          </div>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-0.5 font-medium">
        <Battery />
        <span className="hidden px-1.5 md:block">
          <WifiGlyph />
        </span>
        <button
          type="button"
          aria-label={isDark ? "Switch to light appearance" : "Switch to dark appearance"}
          onClick={toggleTheme}
          className="menu-trigger grid h-6 w-7 place-items-center rounded-[5px]"
        >
          <Icon name={isDark ? "moon" : "sun"} className="h-[14px] w-[14px]" />
        </button>
        <time dateTime={now.toISOString()} className="whitespace-nowrap px-2 tabular-nums">
          <span className="hidden sm:inline">{date}&nbsp;&nbsp;</span>
          {time}
        </time>
      </div>
    </header>
  )
}
