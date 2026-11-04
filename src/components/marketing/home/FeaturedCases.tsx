import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CaseCard } from "@/components/marketing/CaseCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { revealContainer, revealItem } from "@/components/motion/Reveal";
import { caseStudies } from "@/data/caseStudies";

export function FeaturedCases() {
  return (
    <section className="container py-28 md:py-36" aria-labelledby="cases-h">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading index="06" eyebrow="Case studies" title={<span id="cases-h">What production AI looks like.</span>}
          description="Three demonstration engagements — fictional companies, realistic delivery. Figures are illustrative, not customer-verified." />
        <Link to="/case-studies" className="shrink-0 text-[14px] text-ink-300 underline-offset-4 hover:text-white hover:underline">All case studies →</Link>
      </div>
      <motion.div variants={revealContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
        {caseStudies.map((cs, i) => (
          <motion.div key={cs.id} variants={revealItem}><CaseCard cs={cs} large={i === 0} /></motion.div>
        ))}
      </motion.div>
    </section>
  );
}
