import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "@/data/caseStudies";
import { cn } from "@/lib/utils";

/** Case study card with a generative "signal" header unique to each case. */
export function CaseCard({ cs, className, large }: { cs: CaseStudy; className?: string; large?: boolean }) {
  const lead = cs.results[0];
  return (
    <Link to={`/case-studies/${cs.id}`} className={cn("group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[.07] bg-ink-900 transition-colors hover:border-white/[.15]", className)}>
      <div className={cn("relative overflow-hidden border-b border-white/[.06]", large ? "h-64" : "h-44")} style={{ background: "#232A25" }}>
        <svg viewBox="0 0 400 180" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => {
            const y = 20 + i * 11;
            const amp = 8 + (i % 4) * 6;
            return (
              <path key={i} d={`M0 ${y} C100 ${y - amp}, 180 ${y + amp}, 260 ${y - amp / 2} S 360 ${y + amp}, 400 ${y}`}
                fill="none" stroke={cs.accent} strokeOpacity={0.08 + (i / 14) * 0.25} strokeWidth="1"
                className="transition-transform duration-700 ease-out group-hover:translate-x-[-12px]" />
            );
          })}
        </svg>
        <div className="absolute bottom-5 left-6">
          <p className="text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.05em] text-white">{lead.value}{lead.suffix}</p>
          <p className="mt-2 max-w-[16rem] text-[12.5px] text-ink-300">{lead.label}</p>
        </div>
        <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-ink-950/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-300 backdrop-blur">Illustrative</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500">{cs.industry} · {cs.client}</p>
        <h3 className="mt-3 text-xl font-medium tracking-[-0.025em] text-white">{cs.title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-400">{cs.summary}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-6 text-[13px] text-ink-300 transition-colors group-hover:text-white">
          Read the case study <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
