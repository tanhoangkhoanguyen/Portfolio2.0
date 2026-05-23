/** Muted light theme — soft gray-sky, not a bright wash */
export function SkyBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 block bg-gradient-to-b from-slate-200/85 via-slate-100/92 to-slate-100 dark:hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_18%,rgba(255,255,255,0.35),transparent_52%)]" />
    </div>
  )
}
