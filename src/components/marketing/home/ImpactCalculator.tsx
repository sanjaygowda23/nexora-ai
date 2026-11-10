import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

type SliderDef = { key: keyof Inputs; label: string; min: number; max: number; step: number; format: (v: number) => string };
type Inputs = { volume: number; minutes: number; rate: number; automation: number };

const SLIDERS: SliderDef[] = [
  { key: "volume", label: "Monthly cases handled", min: 1000, max: 100000, step: 1000, format: (v) => formatNumber(v) },
  { key: "minutes", label: "Minutes of work per case", min: 2, max: 60, step: 1, format: (v) => `${v} min` },
  { key: "rate", label: "Loaded cost per hour", min: 15, max: 150, step: 5, format: (v) => `$${v}` },
  { key: "automation", label: "Share AI can handle", min: 10, max: 80, step: 5, format: (v) => `${v}%` },
];

const money = (v: number) => (v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : `$${formatNumber(Math.round(v / 1000))}k`);

/** Interactive, transparent ROI model. Every figure is derived from the four inputs shown. */
export function ImpactCalculator() {
  const [v, setV] = useState<Inputs>({ volume: 25000, minutes: 12, rate: 45, automation: 40 });

  const r = useMemo(() => {
    const hoursMonthly = (v.volume * v.minutes * (v.automation / 100)) / 60;
    const annualSavings = hoursMonthly * 12 * v.rate;
    const fte = hoursMonthly / 140;
    const aiCost = v.volume * (v.automation / 100) * 12 * 0.06; // illustrative per-case AI run cost
    const net = annualSavings - aiCost;
    const payback = net > 0 ? Math.max(1, Math.round((90000 / (net / 12)) * 10) / 10) : null; // vs. illustrative implementation cost
    return { hoursMonthly, annualSavings, fte, net, payback };
  }, [v]);

  return (
    <section className="container py-28 md:py-36" aria-labelledby="impact-h">
      <SectionHeading index="05" eyebrow="Business impact" title={<span id="impact-h">Model the impact on your operation.</span>}
        description="Adjust the inputs to see an indicative estimate. The maths is simple and visible — the kind of model we build with you in week one." />

      <div className="mt-14 grid overflow-hidden rounded-2xl border border-white/[.07] lg:grid-cols-[1fr_1.1fr]">
        <form className="space-y-8 bg-ink-900 p-6 md:p-10" onSubmit={(e) => e.preventDefault()} aria-label="Impact inputs">
          {SLIDERS.map((s) => {
            const pct = ((v[s.key] - s.min) / (s.max - s.min)) * 100;
            return (
              <div key={s.key}>
                <div className="flex items-baseline justify-between gap-4">
                  <label htmlFor={`sl-${s.key}`} className="text-[14px] text-ink-300">{s.label}</label>
                  <output htmlFor={`sl-${s.key}`} className="font-mono text-[14px] text-white">{s.format(v[s.key])}</output>
                </div>
                <input
                  id={`sl-${s.key}`}
                  type="range"
                  min={s.min} max={s.max} step={s.step}
                  value={v[s.key]}
                  onChange={(e) => setV((p) => ({ ...p, [s.key]: Number(e.target.value) }))}
                  className="alder-range mt-4 w-full"
                  style={{ ["--pct" as string]: `${pct}%` }}
                />
              </div>
            );
          })}
        </form>

        <div className="relative flex flex-col justify-between gap-10 overflow-hidden bg-ink-850 p-6 md:p-10" aria-live="polite">
          <div className="grid-guides absolute inset-0 opacity-40" aria-hidden />
          <div className="relative">
            <p className="eyebrow">Indicative annual capacity released</p>
            <motion.p key={money(r.annualSavings)} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-[clamp(3rem,7vw,5.5rem)] font-medium leading-none tracking-[-0.05em] text-white">
              {money(r.annualSavings)}
            </motion.p>
          </div>
          <dl className="relative grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              ["Hours / month", formatNumber(Math.round(r.hoursMonthly))],
              ["FTE equivalent", r.fte.toFixed(1)],
              ["Payback", r.payback ? `${r.payback} mo` : "—"],
            ].map(([k, val]) => (
              <div key={k} className="bg-ink-900/90 p-4">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500">{k}</dt>
                <dd className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">{val}</dd>
              </div>
            ))}
          </dl>
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xs text-[12px] leading-relaxed text-ink-500">Illustrative estimate only. Assumes $0.06 AI cost per automated case and a $90k implementation for payback. Not a quote or guarantee.</p>
            <Button asChild variant="primary" signal><Link to="/contact">Get a real model</Link></Button>
          </div>
        </div>
      </div>

    </section>
  );
}
