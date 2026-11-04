import { Link } from "react-router-dom";
import { ArchitectureDiagram, LAYERS, type LayerId } from "@/components/marketing/ArchitectureDiagram";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

const ORDER: LayerId[] = ["integration", "orchestration", "processing", "ingestion", "governance", "monitoring"];

export function ArchitectureSection() {
  return (
    <section className="relative border-y border-white/[.06] bg-ink-900/40 py-28 md:py-36" aria-labelledby="arch-h">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            index="03"
            eyebrow="Platform"
            title={<span id="arch-h">An operating layer for enterprise AI.</span>}
            description="Four layers move data to action. Governance and monitoring wrap every one of them — so nothing an agent does is invisible or unaccountable."
          />
          <Reveal delay={0.1}>
            <Button asChild variant="secondary" size="md" signal><Link to="/platform">Explore the architecture</Link></Button>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14 hidden rounded-2xl border border-white/[.07] bg-ink-950/60 p-6 md:block">
          <ArchitectureDiagram />
        </Reveal>

        {/* Mobile: the same model as a readable stack */}
        <ol className="mt-12 space-y-2 md:hidden">
          {ORDER.map((id, i) => (
            <li key={id} className="flex items-start gap-4 rounded-xl border border-white/[.07] bg-ink-900 p-4">
              <span className="font-mono text-[11px] text-signal">{i < 4 ? `L${4 - i}` : "∀"}</span>
              <div>
                <p className="text-[15px] font-medium text-white">{LAYERS[id].title}</p>
                <p className="mt-0.5 text-[13px] text-ink-400">{LAYERS[id].short}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
