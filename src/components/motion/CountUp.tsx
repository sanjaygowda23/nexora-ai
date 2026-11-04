import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function CountUp({ to, decimals = 0, prefix = "", suffix = "", duration = 1.6, className }: {
  to: number; decimals?: number; prefix?: string; suffix?: string; duration?: number; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${prefix}${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`);
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration, ease: [0.22, 0.7, 0.2, 1] });
    return () => c.stop();
  }, [inView, to, duration, mv]);
  return <motion.span ref={ref} className={className}>{text}</motion.span>;
}
