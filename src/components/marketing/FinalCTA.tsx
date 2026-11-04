import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { HorizonGlow } from "./home/HorizonGlow";

export function FinalCTA({ title = "Put your first agent into production this quarter.", body = "Start with a two-week readiness sprint. Leave with a prioritised roadmap, a business case and a working prototype." }: { title?: string; body?: string }) {
  return (
    <section className="container pb-28 md:pb-36" aria-labelledby="cta-h">
      <Reveal className="relative overflow-hidden rounded-3xl border border-white/[.08] bg-ink-900 px-6 py-20 text-center md:px-16 md:py-28">
        <HorizonGlow className="pointer-events-none absolute inset-0 h-full w-full opacity-90" />
        <div className="grid-guides pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
        <div className="relative mx-auto max-w-3xl">
          <p className="eyebrow text-signal">Next step</p>
          <h2 id="cta-h" className="mt-5 text-display-lg font-medium text-white">{title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-ink-300">{body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="xl" signal><Link to="/contact">Book a consultation</Link></Button>
            <Button asChild size="xl" variant="secondary"><Link to="/app/dashboard">Try the live console</Link></Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
