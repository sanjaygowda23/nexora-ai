import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Compact animated workflow illustration: steps joined by flowing connectors. */
export function FlowStrip({ steps, accent = "#4C7DFF", className }: { steps: string[]; accent?: string; className?: string }) {
  return (
    <ol className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0", className)} aria-label="Workflow">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center sm:flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative flex w-full items-center gap-2.5 rounded-xl border border-white/[.08] bg-ink-950/70 px-3.5 py-3 sm:w-auto"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[10px]" style={{ background: `${accent}22`, color: accent }}>{i + 1}</span>
            <span className="whitespace-nowrap text-[13px] text-ink-100">{s}</span>
          </motion.div>
          {i < steps.length - 1 && (
            <span className="relative mx-2 hidden h-px flex-1 overflow-hidden bg-white/10 sm:block" aria-hidden>
              <span className="absolute inset-y-0 w-10 animate-[flow_1.8s_linear_infinite]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, animationDelay: `${i * 0.3}s` }} />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
