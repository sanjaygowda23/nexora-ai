import { motion } from "framer-motion";
import { motionEase } from "@/styles/tokens";

export function PageHero({ title, description, children }: { eyebrow: string; title: React.ReactNode; description: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-20 md:pt-44">
      <div className="container relative">
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08, ease: motionEase }}
          className="mt-6 max-w-4xl text-display-xl font-medium text-white">{title}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: motionEase }}
          className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ink-300">{description}</motion.p>
        {children && <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: motionEase }} className="mt-10">{children}</motion.div>}
      </div>
    </section>
  );
}
