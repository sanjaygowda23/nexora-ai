import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** Teach tailwind-merge our custom type scale so `text-display-lg` isn't mistaken for a colour. */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["display-xl", "display-lg", "display-md", "eyebrow"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);
export const formatCompact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);

export function timeAgo(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

/** Deterministic PRNG so mock data is stable between renders and reloads. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
