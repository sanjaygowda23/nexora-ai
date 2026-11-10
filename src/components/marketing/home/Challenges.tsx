import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { cn } from "@/lib/utils";
import { motionEase } from "@/styles/tokens";

const ITEMS = [
  {
    challenge: "Pilots that never reach production",
    detail: "Proofs of concept impress in demos but stall on security review, integration and ownership.",
    opportunity: "Production-first delivery",
    plan: "Every engagement starts with the governance, integration and run-book needed to go live — not just the model.",
    stat: ["Weeks", "not quarters, from pilot to production path"],
  },
  {
    challenge: "Skilled people stuck in queues",
    detail: "Analysts, agents and engineers spend their best hours on triage, copy-paste and status chasing.",
    opportunity: "Supervised AI agents",
    plan: "Agents take repetitive casework end to end and escalate with context, so people focus on judgment.",
    stat: ["24/7", "coverage on routine work"],
  },
  {
    challenge: "AI that can't be audited",
    detail: "Leadership and regulators can't see what a model did, why, or with which data.",
    opportunity: "Governed by design",
    plan: "Every prompt, tool call and decision is logged, replayable and tied to a policy and an owner.",
    stat: ["100%", "of agent actions traceable"],
  },
  {
    challenge: "Data trapped across systems",
    detail: "Answers live in CRM, ERP, tickets and documents that don't talk to each other.",
    opportunity: "Integration-native AI",
    plan: "Governed connectors let AI read and write where work happens, inheriting existing permissions.",
    stat: ["40+", "enterprise connector patterns"],
  },
];

export function Challenges() {
  const [active, setActive] = useState(0);
  const item = ITEMS[active];
  return (
    <section className="container py-28 md:py-36" aria-labelledby="challenges-h">
      <SectionHeading
        index="01"
        eyebrow="The gap"
        title={<span id="challenges-h">Most companies have AI ambition. <span className="text-ink-500">Few have AI in production.</span></span>}
      />
      <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div role="tablist" aria-label="Business challenges" aria-orientation="vertical" className="divide-y divide-white/[.06] border-y border-white/[.06]">
          {ITEMS.map((it, i) => (
            <button
              key={it.challenge}
              role="tab"
              id={`ch-tab-${i}`}
              aria-selected={active === i}
              aria-controls="ch-panel"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); const n = (i + 1) % ITEMS.length; setActive(n); document.getElementById(`ch-tab-${n}`)?.focus(); }
                if (e.key === "ArrowUp") { e.preventDefault(); const n = (i - 1 + ITEMS.length) % ITEMS.length; setActive(n); document.getElementById(`ch-tab-${n}`)?.focus(); }
              }}
              tabIndex={active === i ? 0 : -1}
              className="group relative flex w-full items-start gap-5 py-6 text-left"
            >
              <span className={cn("font-mono text-[11px] transition-colors", active === i ? "text-signal" : "text-ink-600")}>0{i + 1}</span>
              <span className="flex-1">
                <span className={cn("block text-xl font-medium tracking-[-0.02em] transition-colors md:text-2xl", active === i ? "text-white" : "text-ink-500 group-hover:text-ink-300")}>
                  {it.challenge}
                </span>
                <AnimatePresence initial={false}>
                  {active === i && (
                    <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: motionEase }}
                      className="block overflow-hidden">
                      <span className="block pt-2 text-[15px] text-ink-400">{it.detail}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              {active === i && <motion.span layoutId="ch-bar" className="absolute -left-px bottom-0 top-0 w-px bg-signal" />}
            </button>
          ))}
        </div>

        <div id="ch-panel" role="tabpanel" aria-labelledby={`ch-tab-${active}`} className="relative overflow-hidden rounded-2xl border border-white/[.07] bg-ink-900 p-8 flex flex-col md:min-h-[400px] md:p-10">
          <div className="grid-guides absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: motionEase }} className="relative flex flex-1 flex-col">
              <span className="eyebrow text-brand-400">AI opportunity</span>
              <h3 className="mt-4 text-display-md font-medium text-white">{item.opportunity}</h3>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-300">{item.plan}</p>
              <div className="mt-auto flex items-end gap-4 border-t border-white/[.07] pt-8">
                <span className="text-5xl font-medium tracking-[-0.04em] text-white md:text-6xl">{item.stat[0]}</span>
                <span className="mb-2 max-w-[14rem] text-[13px] text-ink-400">{item.stat[1]}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
