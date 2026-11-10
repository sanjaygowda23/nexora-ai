import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/components/layout/PageMeta";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { FlowStrip } from "@/components/marketing/FlowStrip";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { solutions } from "@/data/solutions";
import { cn } from "@/lib/utils";

/** Scroll-spy: which section id is currently most in view. */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const ids = solutions.map((s) => s.id);

export default function Solutions() {
  usePageMeta("Solutions", "AI consulting, custom AI development, AI agents, workflow automation, enterprise integration and managed AI infrastructure.");
  const active = useScrollSpy(ids);

  return (
    <>
      <PageHero eyebrow="Solutions" title={<>Six ways we put AI <span className="text-ink-500">to work.</span></>}
        description="Each engagement pairs a clear business problem with a production-ready solution, measurable outcomes and the governance to run it safely." />

      <div className="container grid gap-12 pb-28 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Solutions" className="hidden lg:block">
          <ul className="sticky top-28 space-y-1 border-l border-white/[.07]">
            {solutions.map((s) => (
              <li key={s.id}>
                <a href={`#/solutions#${s.id}`} aria-current={active === s.id ? "true" : undefined}
                  className={cn("-ml-px flex items-center gap-3 border-l py-2 pl-4 text-[13.5px] transition-colors",
                    active === s.id ? "border-signal text-white" : "border-transparent text-ink-500 hover:text-ink-300")}>
                  <span className="font-mono text-[10.5px]">{s.index}</span>{s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          {solutions.map((s) => (
            <Reveal key={s.id}>
              <article id={s.id} className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/[.07] bg-ink-900">
                <header className="flex flex-wrap items-start justify-between gap-6 border-b border-white/[.06] p-6 md:p-10">
                  <div className="flex items-start gap-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.06] text-white"><s.icon className="h-5 w-5" /></span>
                    <div>
                      <p className="font-mono text-[11px] text-signal">{s.index}</p>
                      <h2 className="mt-1 text-display-md font-medium text-white">{s.title}</h2>
                      <p className="mt-2 max-w-xl text-[16px] text-ink-300">{s.tagline}</p>
                    </div>
                  </div>
                </header>

                <div className="grid md:grid-cols-2">
                  <div className="border-b border-white/[.06] p-6 md:border-b-0 md:border-r md:p-10">
                    <p className="eyebrow text-danger/80">The business problem</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-300">{s.problem}</p>
                  </div>
                  <div className="p-6 md:p-10">
                    <p className="eyebrow text-brand-400">Our solution</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-300">{s.solution}</p>
                  </div>
                </div>

                <div className="border-y border-white/[.06] bg-ink-950/40 p-6 md:px-10">
                  <p className="eyebrow mb-4">How it flows</p>
                  <FlowStrip steps={s.flow} />
                </div>

                <div className="grid gap-10 p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
                  <div>
                    <p className="eyebrow">Key features</p>
                    <ul className="mt-4 space-y-2.5">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-ink-100"><Check className="mt-0.5 h-4 w-4 shrink-0 text-signal" />{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col">
                    <p className="eyebrow">Business benefits</p>
                    <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[.07] bg-white/[.07]">
                      {s.benefits.map((b) => (
                        <div key={b.label} className="bg-ink-900 p-4">
                          <dt className="sr-only">{b.label}</dt>
                          <dd className="text-[clamp(1.05rem,1.8vw,1.5rem)] font-medium tracking-[-0.03em] text-white">{b.value}</dd>
                          <dd className="mt-1 text-[12px] leading-snug text-ink-400">{b.label}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-auto pt-8">
                      <Button asChild signal><Link to={`/contact?topic=${s.id}`}>{s.cta}</Link></Button>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <FinalCTA />
    </>
  );
}
