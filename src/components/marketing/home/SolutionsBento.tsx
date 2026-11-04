import { motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { revealContainer, revealItem } from "@/components/motion/Reveal";
import { solutions } from "@/data/solutions";
import { cn } from "@/lib/utils";

/** Card with a cursor-following spotlight (CSS vars, no re-renders). */
function SpotlightCard({ className, children, to }: { className?: string; children: React.ReactNode; to: string }) {
  return (
    <motion.div variants={revealItem} className={className}>
      <Link
        to={to}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[.07] bg-ink-900 p-6 transition-colors duration-300 hover:border-white/[.14] md:p-7"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgba(76,125,255,.10), transparent 60%)" }}
        />
        <div className="relative flex h-full flex-col">{children}</div>
      </Link>
    </motion.div>
  );
}

function CardHead({ id }: { id: string }) {
  const s = solutions.find((x) => x.id === id)!;
  return (
    <>
      <div className="flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[.03] text-electric-400">
          <s.icon className="h-[18px] w-[18px]" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-ink-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>
      <h3 className="mt-6 text-[19px] font-medium tracking-[-0.02em] text-white">{s.title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-400">{s.tagline}</p>
    </>
  );
}

export function SolutionsBento() {
  return (
    <section className="container py-28 md:py-36" aria-labelledby="sol-h">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading index="02" eyebrow="Solutions" title={<span id="sol-h">One partner from strategy <br className="hidden md:block" />to steady state.</span>} />
        <Link to="/solutions" className="shrink-0 text-[14px] text-ink-300 underline-offset-4 hover:text-white hover:underline">All solutions →</Link>
      </div>

      <motion.div
        variants={revealContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-6"
      >
        <SpotlightCard to="/solutions#agents" className="md:col-span-4 md:row-span-2">
          <CardHead id="agents" />
          <div className="mt-8 flex-1 rounded-xl border border-white/[.06] bg-ink-950/60 p-4 font-mono text-[12px]">
            <p className="text-ink-500">agent: atlas · request #48213</p>
            <ul className="mt-3 space-y-2.5">
              {[
                ["Plan", "search KB → read account → draft reply", true],
                ["kb.search", "“SSO seat limits” → 3 articles", true],
                ["crm.read", "org=northwind seats=148/150", true],
                ["draft", "reply with cited steps · confidence 0.91", true],
                ["policy", "no approval required for this intent", false],
              ].map(([k, v, done], i) => (
                <li key={i} className="flex items-start gap-3">
                  {done ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" /> : <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-electric-400" />}
                  <span className="w-20 shrink-0 text-electric-400">{k as string}</span>
                  <span className="text-ink-300">{v as string}</span>
                </li>
              ))}
            </ul>
          </div>
        </SpotlightCard>
        <SpotlightCard to="/solutions#consulting" className="md:col-span-2"><CardHead id="consulting" /></SpotlightCard>
        <SpotlightCard to="/solutions#automation" className="md:col-span-2"><CardHead id="automation" /></SpotlightCard>
        {["development", "integration", "infrastructure"].map((id) => (
          <SpotlightCard key={id} to={`/solutions#${id}`} className={cn("md:col-span-2")}><CardHead id={id} /></SpotlightCard>
        ))}
      </motion.div>
    </section>
  );
}
