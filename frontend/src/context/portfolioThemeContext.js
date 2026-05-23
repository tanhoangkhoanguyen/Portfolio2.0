import { createContext } from "react"

/* 
Creates a new Context object with `null` is the default value
`export const` -> Makes it available to other files
`ThemeContext` -> "light"/"dark"
*/
export const ThemeContext = createContext(null)