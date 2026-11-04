import { ArrowLeft, ArrowRight, Info, Lightbulb } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { usePageMeta } from "@/components/layout/PageMeta";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { caseStudies } from "@/data/caseStudies";

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="grid gap-6 border-t border-white/[.07] py-14 md:grid-cols-[220px_1fr]" aria-labelledby={`b-${n}`}>
        <div>
          <p className="font-mono text-[11px] text-signal">{n}</p>
          <h2 id={`b-${n}`} className="mt-2 text-[20px] font-medium tracking-[-0.02em] text-white">{title}</h2>
        </div>
        <div>{children}</div>
      </section>
    </Reveal>
  );
}

export default function CaseStudyDetail() {
  const { id } = useParams();
  const idx = caseStudies.findIndex((c) => c.id === id);
  const cs = caseStudies[idx];
  usePageMeta(cs ? cs.title : "Case study", cs?.summary);
  if (!cs) return <Navigate to="/case-studies" replace />;
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <>
      <header className="relative overflow-hidden pb-16 pt-32 md:pt-40" style={{ background: `radial-gradient(70% 60% at 15% 0%, ${cs.accent}26, transparent 70%)` }}>
        <div className="grid-guides pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
        <div className="container relative">
          <Link to="/case-studies" className="inline-flex items-center gap-2 text-[13px] text-ink-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> All case studies</Link>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-400">{cs.industry} · {cs.client} (fictional) · {cs.duration}</p>
          <h1 className="mt-4 max-w-4xl text-display-xl font-medium text-white">{cs.title}</h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ink-300">{cs.summary}</p>
          <p className="mt-8 inline-flex items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/[.06] px-4 py-3 text-[13px] text-ink-300">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" /> Illustrative case study. Company and figures are fictional examples, not verified outcomes.
          </p>

          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.08] lg:grid-cols-4">
            {cs.results.map((r) => (
              <div key={r.label} className="bg-ink-900 p-6">
                <dd className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-none tracking-[-0.04em] text-white">
                  <CountUp to={r.value} decimals={r.decimals ?? 0} prefix={r.prefix} />
                  <span className="text-ink-400">{r.suffix}</span>
                </dd>
                <dt className="mt-3 text-[13px] text-ink-400">{r.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-3 font-mono text-[10.5px] text-ink-500">Measurable illustrative results</p>
        </div>
      </header>

      <article className="container pb-20">
        <Block n="01" title="Business background"><p className="max-w-2xl text-[16px] leading-relaxed text-ink-300">{cs.background}</p></Block>
        <Block n="02" title="Problem statement"><p className="max-w-2xl text-[16px] leading-relaxed text-ink-300">{cs.problem}</p></Block>
        <Block n="03" title="Implemented solution"><p className="max-w-2xl text-[16px] leading-relaxed text-ink-300">{cs.solution}</p></Block>
        <Block n="04" title="Technology architecture">
          <ol className="space-y-2">
            {cs.architecture.map((a) => (
              <li key={a.layer} className="relative grid gap-2 rounded-xl border border-white/[.07] bg-ink-900 p-4 sm:grid-cols-[150px_1fr] sm:items-center">
                <span className="flex items-center gap-2.5 font-mono text-[12px]" style={{ color: cs.accent }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: cs.accent }} aria-hidden />{a.layer}
                </span>
                <span className="text-[14.5px] text-ink-300">{a.detail}</span>
              </li>
            ))}
          </ol>
        </Block>
        <Block n="05" title="Implementation process">
          <ol className="grid gap-px overflow-hidden rounded-xl border border-white/[.07] bg-white/[.07] sm:grid-cols-2 lg:grid-cols-4">
            {cs.process.map((p) => (
              <li key={p.phase} className="bg-ink-900 p-5">
                <p className="font-mono text-[11px] text-ink-500">{p.weeks}</p>
                <p className="mt-2 text-[16px] font-medium text-white">{p.phase}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-400">{p.detail}</p>
              </li>
            ))}
          </ol>
        </Block>
        <Block n="06" title="Measurable illustrative results">
          <ul className="space-y-3">
            {cs.results.map((r) => (
              <li key={r.label} className="flex items-baseline gap-4 border-b border-white/[.06] pb-3">
                <span className="w-32 shrink-0 font-mono text-[15px] text-white">{r.prefix}{r.value}{r.suffix}</span>
                <span className="text-[14.5px] text-ink-400">{r.label}</span>
              </li>
            ))}
          </ul>
        </Block>
        <Block n="07" title="Lessons learned">
          <ul className="space-y-3">
            {cs.lessons.map((l) => (
              <li key={l} className="flex gap-3 rounded-xl border border-white/[.07] bg-ink-900 p-4 text-[15px] text-ink-100">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" />{l}
              </li>
            ))}
          </ul>
        </Block>

        <Link to={`/case-studies/${next.id}`} className="group mt-10 flex items-center justify-between gap-6 rounded-2xl border border-white/[.07] bg-ink-900 p-8 transition-colors hover:border-white/[.15]">
          <div>
            <p className="eyebrow">Next case study</p>
            <p className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">{next.title}</p>
          </div>
          <ArrowRight className="h-6 w-6 text-ink-400 transition group-hover:translate-x-1 group-hover:text-white" />
        </Link>
      </article>
      <FinalCTA />
    </>
  );
}
