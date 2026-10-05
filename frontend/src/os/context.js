import { createContext, useContext } from "react"

// Kept out of OSProvider.jsx so that file only exports components (react-refresh)
export const OSContext = createContext(null)

export function useOS() {
  const ctx = useContext(OSContext)
  if (!ctx) throw new Error("useOS must be used within OSProvider")
  return ctx
}
