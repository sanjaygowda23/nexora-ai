import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { usePageMeta } from "@/components/layout/PageMeta";
import { CaseCard } from "@/components/marketing/CaseCard";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PageHero } from "@/components/marketing/PageHero";
import { revealContainer, revealItem } from "@/components/motion/Reveal";
import { caseStudies } from "@/data/caseStudies";

export default function CaseStudies() {
  usePageMeta("Case Studies", "Demonstration case studies: enterprise support automation, marketing workflow intelligence and construction risk intelligence.");
  return (
    <>
      <PageHero eyebrow="Case studies" title={<>From pilot <span className="text-ink-500">to production.</span></>}
        description="Three demonstration engagements showing how we scope, build and run enterprise AI — from background and architecture to lessons learned.">
        <p className="inline-flex max-w-2xl items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/[.06] px-4 py-3 text-[13.5px] text-ink-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          These are illustrative case studies. The companies are fictional and all results are example figures, not verified customer outcomes.
        </p>
      </PageHero>
      <section className="container pb-28" aria-label="Case study list">
        <motion.div variants={revealContainer} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => <motion.div key={cs.id} variants={revealItem}><CaseCard cs={cs} large /></motion.div>)}
        </motion.div>
      </section>
      <FinalCTA />
    </>
  );
}
