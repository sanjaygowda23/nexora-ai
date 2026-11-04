import { motion, useScroll, useSpring } from "framer-motion";
import { Compass, PenTool, Rocket, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { motionEase } from "@/styles/tokens";

const STEPS = [
  { icon: Compass, title: "Discover", time: "Weeks 1–2", body: "Map processes, data and constraints. Score opportunities on value, feasibility and risk.", out: ["Opportunity map", "Data readiness audit", "Business case"] },
  { icon: PenTool, title: "Design", time: "Weeks 3–5", body: "Define agent behaviour, guardrails, integrations and the evaluation set that decides go-live.", out: ["Solution blueprint", "Policy & approval rules", "Eval suite"] },
  { icon: Rocket, title: "Deploy", time: "Weeks 6–10", body: "Ship in shadow mode, then ramp traffic in stages as quality and trust are proven.", out: ["Production release", "Run-books", "Team enablement"] },
  { icon: TrendingUp, title: "Optimise", time: "Ongoing", body: "Monitor cost, quality and outcomes. Retrain, re-route and extend to the next use case.", out: ["Monthly reviews", "Cost tuning", "Roadmap updates"] },
];

/** Light "paper" section — breaks the dark rhythm and reads like a methodology document. */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="relative bg-paper py-28 text-ink-950 md:py-36" aria-labelledby="how-h">
      <div className="grid-guides-light pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" aria-hidden />
      <div className="container relative">
        <SectionHeading tone="light" index="04" eyebrow="How it works" title={<span id="how-h">Discover → Design → Deploy → Optimise.</span>}
          description="A delivery method built to get AI into production safely, then keep it improving." />

        <div ref={ref} className="relative mt-16">
          {/* Progress rail */}
          <div className="absolute left-[19px] top-0 h-full w-px bg-paper-line lg:left-0 lg:top-[19px] lg:h-px lg:w-full" aria-hidden>
            <motion.div style={{ scaleY: progress }} className="h-full w-full origin-top bg-electric lg:hidden" />
            <motion.div style={{ scaleX: progress }} className="hidden h-full w-full origin-left bg-electric lg:block" />
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <motion.li key={s.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: motionEase }} className="relative pl-14 lg:pl-0 lg:pt-16">
                  <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-paper-line bg-white text-electric-600 shadow-sm">
                    <s.icon className="h-[18px] w-[18px]" />
                  </span>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500">0{i + 1} · {s.time}</p>
                  <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{s.body}</p>
                  <ul className="mt-5 space-y-1.5 border-t border-paper-line pt-4">
                    {s.out.map((o) => (
                      <li key={o} className="flex items-center gap-2 text-[13px] text-ink-700">
                        <span className="h-1 w-1 rounded-full bg-electric" aria-hidden /> {o}
                      </li>
                    ))}
                  </ul>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
