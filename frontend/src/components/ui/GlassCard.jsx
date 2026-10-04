/** Frosted panel shared by project and experience cards. Pass shadow/padding via `className`. */
export function GlassCard({ as: Tag = "div", className = "", children }) {
  return (
    <Tag
      className={`rounded-2xl border border-sky-200/50 bg-white/55 backdrop-blur-md dark:border-slate-700/45 dark:bg-slate-950/70 ${className}`}
    >
      {children}
    </Tag>
  )
}
