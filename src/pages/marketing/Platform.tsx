import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePageMeta } from "@/components/layout/PageMeta";
import { ArchitectureDiagram, LAYERS, type LayerId } from "@/components/marketing/ArchitectureDiagram";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motionEase } from "@/styles/tokens";

const ORDER: LayerId[] = ["ingestion", "processing", "orchestration", "integration", "monitoring", "governance"];

const JOURNEY = [
  { t: "0 ms", layer: "ingestion" as LayerId, m: "Invoice PDF lands in the AP inbox; OCR + schema extraction start." },
  { t: "380 ms", layer: "governance" as LayerId, m: "Bank details redacted; policy confirms the vendor tier can be auto-processed." },
  { t: "1.2 s", layer: "processing" as LayerId, m: "Vision M extracts 14 line items; retrieval pulls the matching PO." },
  { t: "2.1 s", layer: "orchestration" as LayerId, m: "Agent Docket finds a 3% price variance and pauses for approval." },
  { t: "4 min", layer: "integration" as LayerId, m: "Approver accepts in Slack; entry is posted to the ERP via connector." },
  { t: "4 min", layer: "monitoring" as LayerId, m: "Trace, cost ($0.04) and outcome recorded; dashboard updates." },
];

export default function Platform() {
  usePageMeta("Platform", "An operating layer for enterprise AI: ingestion, AI processing, agent orchestration, integration, monitoring and governance.");
  const { hash } = useLocation();
  const [sel, setSel] = useState<LayerId>("orchestration");
  useEffect(() => { const h = hash.slice(1) as LayerId; if (h in LAYERS) setSel(h); }, [hash]);
  const L = LAYERS[sel];

  return (
    <>
      <PageHero eyebrow="Platform" title={<>The operating layer <span className="text-ink-500">for enterprise AI.</span></>}
        description="Six components, one governed system. Select any layer to see what it does and how it connects to the rest.">
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" signal><Link to="/app/dashboard">Open the live console</Link></Button>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Talk to an architect</Link></Button>
        </div>
      </PageHero>

      {/* Interactive architecture */}
      <section className="container pb-28" aria-label="Interactive architecture">
        <div className="grid overflow-hidden rounded-2xl border border-white/[.07] bg-ink-900 xl:grid-cols-[1.6fr_1fr]">
          <div className="relative border-b border-white/[.06] p-4 md:p-8 xl:border-b-0 xl:border-r">
            <div className="grid-guides absolute inset-0 opacity-40" aria-hidden />
            <p className="relative mb-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-500">Click or tab to a layer · Enter to select</p>
            <ArchitectureDiagram selected={sel} onSelect={setSel} className="relative hidden md:block" />
            <div role="tablist" aria-label="Layers" className="relative grid grid-cols-2 gap-2 md:hidden">
              {ORDER.map((id) => (
                <button key={id} role="tab" aria-selected={sel === id} onClick={() => setSel(id)}
                  className={cn("rounded-lg border px-3 py-2.5 text-left text-[13px]", sel === id ? "border-brand bg-brand/10 text-white" : "border-white/10 text-ink-300")}>
                  {LAYERS[id].title}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 md:p-8" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={sel} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.35, ease: motionEase }}>
                <p className="eyebrow text-signal">Selected layer</p>
                <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-white">{L.title}</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-300">{L.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {L.parts.map((p) => <span key={p} className="rounded-full border border-white/10 bg-white/[.03] px-2.5 py-1 font-mono text-[11px] text-ink-300">{p}</span>)}
                </div>
                <dl className="mt-8 divide-y divide-white/[.06] border-y border-white/[.06]">
                  {L.specs.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-3 text-[13.5px]"><dt className="text-ink-500">{k}</dt><dd className="text-right text-ink-100">{v}</dd></div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Request journey */}
      <section className="border-y border-white/[.06] bg-ink-900/40 py-28" aria-labelledby="journey-h">
        <div className="container grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading eyebrow="Anatomy of a run" title={<span id="journey-h">One invoice, six layers, four minutes.</span>}
            description="Hover a step to light up the layer it touches. Every run produces a replayable trace like this." />
          <ol className="relative space-y-1 border-l border-white/10 pl-6">
            {JOURNEY.map((j, i) => (
                <li key={i} className="group relative cursor-default rounded-xl p-4 transition-colors hover:bg-white/[.03]" onMouseEnter={() => setSel(j.layer)}>
                  <span className={cn("absolute -left-[31px] top-5 h-2.5 w-2.5 rounded-full border-2 border-ink-950 transition-colors", sel === j.layer ? "bg-signal" : "bg-ink-600")} aria-hidden />
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-mono text-[12px] text-brand-400">{j.t}</span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500">{LAYERS[j.layer].title}</span>
                  </div>
                  <p className="mt-1.5 text-[15px] text-ink-100">{j.m}</p>
                </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Deep dives (anchor targets for nav) */}
      <section className="container py-28" aria-labelledby="layers-h">
        <SectionHeading eyebrow="Components" title={<span id="layers-h">Every layer, in detail.</span>} />
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ORDER.map((id, i) => (
            <Reveal key={id} delay={(i % 3) * 0.06}>
              <article id={id} className="h-full scroll-mt-28 rounded-2xl border border-white/[.07] bg-ink-900 p-7 transition-colors hover:border-white/[.14]">
                <p className="font-mono text-[11px] text-ink-500">0{i + 1}</p>
                <h3 className="mt-3 text-xl font-medium tracking-[-0.02em] text-white">{LAYERS[id].title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-400">{LAYERS[id].body}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {LAYERS[id].parts.map((p) => <li key={p} className="rounded-md bg-white/[.04] px-2 py-1 font-mono text-[10.5px] text-ink-300">{p}</li>)}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <FinalCTA title="See the platform running." body="The live console is a working demo: browse agents, build a workflow and execute it in your browser." />
    </>
  );
}
