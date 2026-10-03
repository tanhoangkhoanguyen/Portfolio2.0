export function SectionHeading({ children, className = "" }) {
  return (
    <h2
      className={`font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white ${className}`}
    >
      {children}
    </h2>
  )
}
