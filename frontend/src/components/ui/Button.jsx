import { useMagnetic } from "../../hooks/useMagnetic"

/** primary: dark pill with a rotating aurora border · secondary: glass pill with a cursor-lit edge */
const VARIANTS = {
  primary: "btn-aurora",
  secondary: "btn-ghost",
}

const SIZES = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
}

export function Button({ variant = "primary", size = "md", href, className = "", children, ...props }) {
  const magnetic = useMagnetic()
  const classes = `btn ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  const content = <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
  if (href)
    return (
      <a href={href} className={classes} {...magnetic} {...props}>
        {content}
      </a>
    )
  return (
    <button type="button" className={classes} {...magnetic} {...props}>
      {content}
    </button>
  )
}
