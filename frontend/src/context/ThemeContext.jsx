import { useLayoutEffect, useMemo, useState } from "react"
import { ThemeContext } from "./theme"

const STORAGE_KEY = "portfolio-theme"

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem(STORAGE_KEY) || "dark"
    // "light" or null
  )

  // Run before the browser paints the screen
  useLayoutEffect(() => {
    const root = document.documentElement                                          // Get <html> element 
    root.classList.toggle("dark", theme === "dark")                                // If theme is "dark", then add class "dark". Else → remove "dark"
    window.localStorage.setItem(STORAGE_KEY, theme)                                // Save to localStorage, so refresh keeps your theme
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),       // Flip between modes
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}