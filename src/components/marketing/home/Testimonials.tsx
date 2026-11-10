import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { testimonials } from "@/data/caseStudies";
import { motionEase } from "@/styles/tokens";

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = testimonials[i];
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, [paused]);
  const go = (d: number) => setI((x) => (x + d + testimonials.length) % testimonials.length);

  return (
    <section className="container py-28 md:py-36" aria-labelledby="t-h" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)}>
      <SectionHeading index="08" eyebrow="Voices" title={<span id="t-h">How teams describe the work.</span>} />
      <figure className="relative mt-14 rounded-2xl border border-white/[.07] bg-ink-900 p-8 md:p-14" aria-roledescription="carousel">
        <span className="absolute right-6 top-6 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-warning">Illustrative demo profile</span>
        <span aria-hidden className="block font-display text-7xl leading-none text-brand/60">“</span>
        <div className="min-h-[9rem] md:min-h-[7.5rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.blockquote key={i} initial={{ opacity: 0, y: 10, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(6px)" }} transition={{ duration: 0.5, ease: motionEase }}
              className="max-w-4xl text-[clamp(1.35rem,2.6vw,2.1rem)] font-medium leading-snug tracking-[-0.025em] text-white">
              {t.quote}
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <figcaption className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/[.07] pt-6">
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-brand to-mineral text-[14px] font-semibold text-white" aria-hidden>
              {t.name.split(" ").map((n) => n[0]).join("")}
            </span>
            <div>
              <p className="text-[15px] font-medium text-white">{t.name}</p>
              <p className="text-[13px] text-ink-400">{t.role}, {t.company} <span className="text-ink-600">(fictional)</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] text-ink-500">{String(i + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}</span>
            <button onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ink-300 transition hover:border-white/25 hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => go(1)} aria-label="Next testimonial" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-ink-300 transition hover:border-white/25 hover:text-white"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
