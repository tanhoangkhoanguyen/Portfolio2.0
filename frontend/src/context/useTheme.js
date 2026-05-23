import { useContext } from "react"
import { ThemeContext } from "./portfolioThemeContext"

export function useTheme() {
  const ctx = useContext(ThemeContext)                               // Gets the current value from ThemeContext
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return ctx
}