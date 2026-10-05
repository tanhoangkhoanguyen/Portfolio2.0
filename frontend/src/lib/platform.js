export const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)

/** Modifier shown in shortcut hints (⌘ on Apple devices, Ctrl elsewhere). */
export const MOD_KEY = IS_MAC ? "⌘" : "Ctrl"

export const openLink = (href) => window.open(href, "_blank", "noopener,noreferrer")
