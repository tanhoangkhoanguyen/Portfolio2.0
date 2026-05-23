// Smooth-scroll to a section by its `id` (matches `<section id="...">`)
export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: "smooth", block: "start" })
}