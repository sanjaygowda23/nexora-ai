import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { industries } from "@/data/industries";
import { cn } from "@/lib/utils";
import { motionEase } from "@/styles/tokens";

export function IndustryShowcase() {
  const [active, setActive] = useState(industries[0].id);
  const ind = industries.find((i) => i.id === active)!;
  return (
    <section className="relative border-y border-white/[.06] bg-ink-900/40 py-28 md:py-36" aria-labelledby="ind-h">
      <div className="container">
        <SectionHeading index="07" eyebrow="Industries" title={<span id="ind-h">Built for regulated, complex operations.</span>} />

        <div role="tablist" aria-label="Industries" className="mt-12 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {industries.map((i) => (
            <button key={i.id} role="tab" aria-selected={active === i.id} aria-controls="ind-panel" onClick={() => setActive(i.id)}
              className={cn("relative flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] transition-colors",
                active === i.id ? "border-transparent text-ink-950" : "border-white/10 text-ink-300 hover:border-white/20 hover:text-white")}>
              {active === i.id && <motion.span layoutId="ind-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <i.icon className="relative h-4 w-4" />
              <span className="relative">{i.name}</span>
            </button>
          ))}
        </div>

        <div id="ind-panel" role="tabpanel" className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div key={ind.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: motionEase }}
              className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
              <div className="flex flex-col rounded-2xl border border-white/[.07] bg-ink-900 p-7">
                <h3 className="text-display-md font-medium text-white">{ind.headline}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-400">{ind.context}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {ind.compliance.map((c) => <span key={c} className="rounded-full border border-signal/25 bg-signal/[.06] px-2.5 py-1 font-mono text-[10.5px] text-signal">{c}</span>)}
                </div>
                <Link to={`/industries#${ind.id}`} className="mt-auto inline-flex items-center gap-1.5 pt-8 text-[14px] text-white hover:text-electric-400">
                  Explore {ind.name.toLowerCase()} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {ind.useCases.map((u, i) => (
                  <li key={u.title} className="flex flex-col gap-3 rounded-2xl border border-white/[.07] bg-ink-900/70 p-6 lg:flex-row lg:items-center lg:gap-6">
                    <span className="font-mono text-[11px] text-ink-600">0{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-[16px] font-medium text-white">{u.title}</p>
                      <p className="mt-1 text-[14px] text-ink-400">{u.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
