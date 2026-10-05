const LIGHTS = [
  {
    key: "close",
    label: "Close window",
    color: "#ff5f57",
    ring: "#e0443e",
    glyph: <path d="M3.7 3.7l4.6 4.6M8.3 3.7L3.7 8.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />,
  },
  {
    key: "minimize",
    label: "Minimize window",
    color: "#febc2e",
    ring: "#dea123",
    glyph: <path d="M2.8 6h6.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />,
  },
  {
    key: "zoom",
    label: "Zoom window",
    color: "#28c840",
    ring: "#1aab29",
    glyph: <path d="M3.3 8.7V4.6l4.1 4.1zM8.7 3.3v4.1L4.6 3.3z" fill="currentColor" />,
  },
]

export function TrafficLights({ focused, onClose, onMinimize, onZoom, zoomDisabled }) {
  const handlers = { close: onClose, minimize: onMinimize, zoom: onZoom }
  return (
    <div className="tl-group relative z-10 flex items-center gap-2">
      {LIGHTS.map((light) => (
        <button
          key={light.key}
          type="button"
          aria-label={light.label}
          onClick={handlers[light.key]}
          disabled={light.key === "zoom" && zoomDisabled}
          data-focused={focused}
          className="traffic-light"
          style={{ "--tl": light.color, "--tl-ring": light.ring }}
        >
          <svg viewBox="0 0 12 12" fill="none">
            {light.glyph}
          </svg>
        </button>
      ))}
    </div>
  )
}
