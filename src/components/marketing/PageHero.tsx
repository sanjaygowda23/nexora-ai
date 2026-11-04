import { motion } from "framer-motion";
import { motionEase } from "@/styles/tokens";

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: React.ReactNode; description: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-20 md:pt-44">
      <div className="grid-guides pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_0%,black,transparent)]" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[420px] w-[620px] rounded-full bg-electric/[.12] blur-[120px]" aria-hidden />
      <div className="container relative">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: motionEase }} className="eyebrow flex items-center gap-3">
          <span className="h-px w-6 bg-white/20" aria-hidden />{eyebrow}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.9, delay: 0.08, ease: motionEase }}
          className="mt-6 max-w-4xl text-display-xl font-medium text-white">{title}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: motionEase }}
          className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ink-300">{description}</motion.p>
        {children && <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: motionEase }} className="mt-10">{children}</motion.div>}
      </div>
    </section>
  );
}
