import { motion, type HTMLMotionProps } from "framer-motion";
import { motionEase } from "@/styles/tokens";

/** Static section wrapper: keep reading content visible while scrolling. */
export function Reveal({ delay: _delay, y: _y, children, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return <motion.div {...props}>{children}</motion.div>;
}

/** Staggers direct children that use `revealItem` variants. */
export const revealContainer = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
export const revealItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: motionEase } },
};
