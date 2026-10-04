import { createContext, useContext } from "react"

// Kept out of ThemeContext.jsx so that file only exports components (react-refresh)
export const ThemeContext = createContext(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return ctx
}
