import { cn } from "@/lib/utils";

/** ALDER mark: a geometric "A" with a signal node at its apex. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden>
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="currentColor" className="text-white/[.06]" stroke="rgba(255,255,255,.12)" />
      <path d="M8 23 16 9 24 23M11 18h10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="9" r="2.6" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="text-[15px] font-semibold tracking-[0.18em] text-current">
          ALDER
        </span>
      )}
    </span>
  );
}
