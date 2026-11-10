import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LetterReveal } from "@/components/motion/LetterReveal";
import { PipelineVisual } from "./PipelineVisual";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { motionEase } from "@/styles/tokens";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: motionEase },
});

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-24 pt-32 md:pt-40" aria-labelledby="hero-title">
      <div className="container relative">

        <div className="grid items-end gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div style={{ ["--lr-final" as string]: "#F4F3EE" }}>
            <LetterReveal
              className="text-display-xl font-medium text-white"
              segments={[{ text: "Turn AI into your" }, "br", { text: "competitive " }, { text: "advantage." }]}
            />
            <span id="hero-title" className="sr-only">Turn AI into your competitive advantage.</span>
          </div>
          <div>
            <motion.p {...(reduce ? {} : fade(0.12))} className="max-w-md text-[17px] leading-relaxed text-ink-300">
              ALDER designs, deploys and operates AI agents that work inside your systems — with the governance, observability and human oversight enterprises require.
            </motion.p>
            <motion.div {...(reduce ? {} : fade(0.2))} className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" signal>
                <Link to="/platform">Explore our platform</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">Book a consultation</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Live console */}
        <div className="mt-16">
          <motion.div
            initial={reduce ? false : { opacity: 0.7, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: motionEase }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.06] px-4 py-3">
              <div className="flex items-center gap-3 text-[12.5px]">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </span>
                <span className="hidden text-ink-500 sm:inline">acme-ops</span><span className="hidden text-ink-600 sm:inline">/</span>
                <span className="whitespace-nowrap font-medium text-white">Support triage</span>
                <span className="rounded-full border border-success/30 bg-success/10 whitespace-nowrap px-2 py-0.5 font-mono text-[10px] text-success">v12 · live</span>
              </div>
              <dl className="hidden gap-6 font-mono text-[11px] md:flex">
                {[["runs today", "12,480"], ["p50 latency", "1.8s"], ["auto-resolved", "46%"], ["approvals pending", "3"]].map(([k, v]) => (
                  <div key={k} className="flex gap-2"><dt className="text-ink-500">{k}</dt><dd className="text-ink-100">{v}</dd></div>
                ))}
              </dl>
            </div>
            <PipelineVisual />
          </motion.div>
          <p className="mt-4 text-center text-xs text-ink-400">Illustrative product visualisation · simulated data</p>
        </div>
      </div>
    </section>
  );
}
