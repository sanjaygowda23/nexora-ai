import { motion, useInView, type HTMLMotionProps } from "framer-motion";
import { useRef } from "react";
import { motionEase } from "@/styles/tokens";

/** Fade-and-rise on first entry into the viewport. */
export function Reveal({ delay = 0, y = 18, children, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: motionEase, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Staggers direct children that use `revealItem` variants. */
export const revealContainer = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
export const revealItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: motionEase } },
};
