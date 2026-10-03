const BASE =
  "inline-flex items-center justify-center rounded-lg py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"

const VARIANTS = {
  primary:
    "bg-sky-600 text-white shadow-sky-600/20 hover:bg-sky-500 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400",
  secondary:
    "border border-sky-500/50 bg-white/80 text-sky-900 hover:border-sky-600 hover:bg-white dark:border-sky-400/40 dark:bg-black/50 dark:text-sky-100 dark:hover:border-sky-300 dark:hover:bg-sky-500/10",
}

const SIZES = {
  sm: "px-5 text-sm shadow-sm",
  md: "px-6 text-base shadow-md",
}

/** Renders an `<a>` when `href` is given, otherwise a `<button>`. */
export function Button({ variant = "primary", size = "sm", href, className = "", ...props }) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  if (href) return <a href={href} className={classes} {...props} />
  return <button type="button" className={classes} {...props} />
}
