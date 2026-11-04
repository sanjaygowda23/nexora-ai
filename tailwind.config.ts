import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import { tokens } from "./src/styles/tokens";

/**
 * Centralised theme. Semantic colours resolve to CSS variables (src/styles/globals.css)
 * so the SaaS app can switch light/dark at runtime; brand colours come from tokens.ts.
 */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: { DEFAULT: "hsl(var(--surface))", 2: "hsl(var(--surface-2))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        ink: tokens.color.ink,
        paper: tokens.color.paper,
        electric: tokens.color.electric,
        violet: tokens.color.violet,
        signal: tokens.color.signal,
        success: tokens.color.success,
        warning: tokens.color.warning,
        danger: tokens.color.danger,
      },
      fontFamily: { sans: tokens.font.sans, display: tokens.font.display, mono: tokens.font.mono },
      fontSize: tokens.fontSize,
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      transitionTimingFunction: { out: tokens.ease.out, spring: tokens.ease.spring },
      keyframes: {
        "dash": { to: { strokeDashoffset: "-24" } },
        "pulse-ring": { "0%": { transform: "scale(.6)", opacity: ".8" }, "100%": { transform: "scale(2.4)", opacity: "0" } },
        "marquee": { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "shimmer": { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
      },
      animation: {
        dash: "dash 1.2s linear infinite",
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(.22,.7,.2,1) infinite",
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
