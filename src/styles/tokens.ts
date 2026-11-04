/**
 * NEXORA design tokens — single source of truth for brand values.
 * Consumed by tailwind.config.ts and by JS-driven visuals (canvas, charts, React Flow).
 */
export const tokens = {
  color: {
    ink: {
      950: "#05070D",
      900: "#090D16",
      850: "#0D121E",
      800: "#121928",
      700: "#1B2436",
      600: "#2A3550",
      500: "#5A6580",
      400: "#8A93A8",
      300: "#B8BFCE",
      100: "#EDF0F7",
    },
    paper: { DEFAULT: "#F5F6F9", 2: "#ECEEF3", line: "#DCE0E8" },
    electric: { DEFAULT: "#4C7DFF", 400: "#7096FF", 600: "#2F5FE8" },
    violet: { DEFAULT: "#8B5CF6", 400: "#A78BFA" },
    signal: { DEFAULT: "#3EE6D2" },
    success: "#34D399",
    warning: "#F5B544",
    danger: "#F2545B",
  },
  font: {
    display: ['"Inter Tight"', "system-ui", "sans-serif"],
    sans: ['"Inter Tight"', "system-ui", "sans-serif"],
    mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
  },
  fontSize: {
    "display-xl": ["clamp(2.75rem, 6.2vw, 5.75rem)", { lineHeight: "0.98", letterSpacing: "-0.045em" }],
    "display-lg": ["clamp(2.25rem, 4.4vw, 4rem)", { lineHeight: "1.02", letterSpacing: "-0.04em" }],
    "display-md": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.06", letterSpacing: "-0.035em" }],
    eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.14em" }],
  } as Record<string, [string, { lineHeight: string; letterSpacing: string }]>,
  ease: { out: "cubic-bezier(.22,.7,.2,1)", spring: "cubic-bezier(.34,1.56,.64,1)" },
} as const;

/**
 * Categorical chart palette — fixed order, never cycled.
 * Validated with the dataviz validator (lightness band, chroma, CVD ΔE ≥ 12, normal ΔE ≥ 27, 3:1 contrast)
 * against both #0D121E (dark) and #FFFFFF (light). Status colours (success/danger) are reserved and separate.
 */
export const chartPalette = ["#4C7DFF", "#C4861E", "#9A62F5", "#16998A"] as const;
export const statusColor = { good: "#22B07D", critical: "#E5484D" } as const;
export const motionEase = [0.22, 0.7, 0.2, 1] as const;
