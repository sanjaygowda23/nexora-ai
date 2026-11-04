import { cn } from "@/lib/utils";

/** NEXORA mark: an "N" drawn as one continuous signal path, terminating in a live node. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden>
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="currentColor" className="text-white/[.06]" stroke="rgba(255,255,255,.12)" />
      <path d="M9 23V9l14 14V9" fill="none" stroke="url(#nx-g)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23" cy="9" r="2.6" fill="#3EE6D2" />
      <defs>
        <linearGradient id="nx-g" x1="9" y1="23" x2="23" y2="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4C7DFF" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="text-[15px] font-semibold tracking-[0.18em] text-current">
          NEXORA<span className="ml-1.5 font-mono text-[10px] font-medium tracking-[0.1em] text-ink-400">AI</span>
        </span>
      )}
    </span>
  );
}
