import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LetterReveal } from "@/components/motion/LetterReveal";
import { HorizonGlow } from "./HorizonGlow";
import { PipelineVisual } from "./PipelineVisual";
import { motionEase } from "@/styles/tokens";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: motionEase },
});

export function Hero() {
  const consoleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: consoleRef, offset: ["start end", "start 0.25"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  return (
    <section className="relative overflow-hidden pb-24 pt-32 md:pt-40" aria-labelledby="hero-title">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="grid-guides absolute inset-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent)]" />
        <motion.div style={{ opacity: glowOpacity }} className="absolute inset-x-0 bottom-0 h-[85%]">
          <HorizonGlow className="h-full w-full" />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <div className="container relative">
        <motion.div {...fade(0)} className="mb-8 flex">
          <Link to="/platform" className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[.03] py-1 pl-1 pr-4 text-[12.5px] text-ink-300 backdrop-blur transition-colors hover:border-white/20 hover:text-white">
            <span className="rounded-full bg-electric/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-electric-400">New</span>
            Agent orchestration with human approval gates
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </motion.div>

        <div className="grid items-end gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div style={{ ["--lr-final" as string]: "#FFFFFF" }}>
            <LetterReveal
              className="text-display-xl font-medium text-white"
              segments={[{ text: "Turn AI into your" }, "br", { text: "competitive " }, { text: "advantage.", color: "#9FB5FF" }]}
            />
            <span id="hero-title" className="sr-only">Turn AI into your competitive advantage.</span>
          </div>
          <div>
            <motion.p {...fade(1.0)} className="max-w-md text-[17px] leading-relaxed text-ink-300">
              ALDER designs, deploys and operates AI agents that work inside your systems — with the governance, observability and human oversight enterprises require.
            </motion.p>
            <motion.div {...fade(1.15)} className="mt-8 flex flex-wrap gap-3">
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
        <div className="mt-20 [perspective:1600px]" ref={consoleRef}>
          <motion.div
            style={{ rotateX, scale, transformOrigin: "50% 0%" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.9, ease: motionEase }}
            className="glass overflow-hidden rounded-2xl bg-ink-900/70 shadow-[0_60px_120px_-40px_rgba(76,125,255,.35),0_0_0_1px_rgba(255,255,255,.04)]"
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
          <p className="mt-4 text-center font-mono text-[10.5px] text-ink-500">Illustrative product visualisation · simulated data</p>
        </div>
      </div>
    </section>
  );
}
