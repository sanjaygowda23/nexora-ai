/**
 * ALDER design tokens — single source of truth for brand values.
 * Consumed by tailwind.config.ts and by JS-driven visuals (canvas, charts, React Flow).
 */
export const tokens = {
  color: {
    ink: {
      950: "#151917",
      900: "#1C211E",
      850: "#232A25",
      800: "#2C352E",
      700: "#39443C",
      600: "#4D5B50",
      500: "#90998F",
      400: "#AAAFA7",
      300: "#CFD3C9",
      100: "#F4F3EE",
    },
    paper: { DEFAULT: "#F4F3EE", 2: "#E9ECE4", line: "#D8DED3" },
    brand: { DEFAULT: "#44705B", 400: "#A8C9A3", 600: "#345743" },
    mineral: { DEFAULT: "#6D858C", 400: "#AAC0C4" },
    signal: { DEFAULT: "#C5D8A4" },
    success: "#91BC9B",
    warning: "#D6B57A",
    danger: "#DB8F86",
  },
  font: {
    display: ['"Inter Tight"', "system-ui", "sans-serif"],
    sans: ['"Inter Tight"', "system-ui", "sans-serif"],
    mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
  },
  fontSize: {
    "display-xl": ["clamp(2.75rem, 6.2vw, 5.75rem)", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
    "display-lg": ["clamp(2.25rem, 4.4vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.04em" }],
    "display-md": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.06", letterSpacing: "-0.035em" }],
    eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.14em" }],
  } as Record<string, [string, { lineHeight: string; letterSpacing: string }]>,
  ease: { out: "cubic-bezier(.22,.7,.2,1)", spring: "cubic-bezier(.34,1.56,.64,1)" },
} as const;

/** Chart series are distinct from brand accents and always paired with labels or legends.
 * Contrast is checked against both light and dark console surfaces.
 */
export const chartPalette = ["#4C7A67", "#A77535", "#617F98", "#987164"] as const;
export const statusColor = { good: "#4C7A67", critical: "#B95F57" } as const;
export const motionEase = [0.22, 0.7, 0.2, 1] as const;
