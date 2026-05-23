export function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL || ""
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalized}`
}