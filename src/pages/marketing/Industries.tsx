import { ArrowUpRight, ShieldCheck, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/components/layout/PageMeta";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { industries } from "@/data/industries";
import { solutions } from "@/data/solutions";

export default function Industries() {
  usePageMeta("Industries", "AI agents and automation for healthcare, financial services, manufacturing, SaaS, retail and construction.");
  return (
    <>
      <PageHero eyebrow="Industries" title={<>Domain depth <span className="text-ink-500">where it matters.</span></>}
        description="Each sector has its own data, regulations and failure modes. Our playbooks start from those constraints, not from a generic model.">
        <nav aria-label="Jump to industry" className="flex flex-wrap gap-2">
          {industries.map((i) => (
            <a key={i.id} href={`#/industries#${i.id}`} className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[13.5px] text-ink-300 transition hover:border-white/25 hover:text-white">
              <i.icon className="h-4 w-4" /> {i.name}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="border-t border-white/[.06]">
        {industries.map((ind, idx) => (
          <section key={ind.id} id={ind.id} aria-labelledby={`${ind.id}-h`} className="scroll-mt-16 border-b border-white/[.06]">
            <div className="container grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.25fr]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[.03] text-brand-400"><ind.icon className="h-5 w-5" /></span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-500">0{idx + 1} · {ind.name}</span>
                </div>
                <h2 id={`${ind.id}-h`} className="mt-6 text-display-md font-medium text-white">{ind.headline}</h2>
                <p className="mt-5 text-[16px] leading-relaxed text-ink-400">{ind.context}</p>
                <div className="mt-8 rounded-xl border border-danger/15 bg-danger/[.04] p-5">
                  <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-danger/80"><TriangleAlert className="h-3.5 w-3.5" /> Pressures we hear</p>
                  <ul className="mt-3 space-y-1.5">
                    {ind.pressures.map((p) => <li key={p} className="text-[14px] text-ink-300">— {p}</li>)}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <p className="eyebrow">Use cases</p>
                {ind.useCases.map((u, i) => (
                  <Reveal key={u.title} delay={i * 0.06}>
                    <article className="group grid gap-4 rounded-2xl border border-white/[.07] bg-ink-900 p-6 transition-colors hover:border-white/[.14] sm:grid-cols-[auto_1fr]">
                      <span className="font-mono text-[12px] text-brand-400">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="text-[18px] font-medium tracking-[-0.02em] text-white">{u.title}</h3>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-400">{u.body}</p>
                        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[.04] px-2.5 py-1 font-mono text-[10.5px] text-ink-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden /> Tracks: {u.metric}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                ))}

                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/[.07] p-6">
                    <p className="eyebrow">Relevant solutions</p>
                    <ul className="mt-4 space-y-2">
                      {ind.solutions.map((sid) => {
                        const s = solutions.find((x) => x.id === sid)!;
                        return (
                          <li key={sid}>
                            <Link to={`/solutions#${sid}`} className="group flex items-center justify-between gap-2 text-[14px] text-ink-100 hover:text-white">
                              <span className="flex items-center gap-2.5"><s.icon className="h-4 w-4 text-ink-500" />{s.title}</span>
                              <ArrowUpRight className="h-4 w-4 text-ink-600 transition group-hover:text-white" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-signal/15 bg-signal/[.03] p-6">
                    <p className="eyebrow text-signal">Controls built in</p>
                    <ul className="mt-4 space-y-2">
                      {ind.compliance.map((c) => <li key={c} className="flex items-center gap-2.5 text-[14px] text-ink-100"><ShieldCheck className="h-4 w-4 text-signal" />{c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
      <FinalCTA title="Your industry, your constraints." body="Bring us your hardest process. We'll come back with a scoped use case, a risk assessment and an honest view of what AI can and can't do there." />
    </>
  );
}
