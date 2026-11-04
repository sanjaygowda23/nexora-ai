import { motion } from "framer-motion";
import { Fragment } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

type Segment = { text: string; className?: string; color?: string };

/**
 * Headline that resolves letter by letter: ghost → blurred → electric → final colour.
 * Words never break mid-word; screen readers get the plain sentence via aria-label.
 */
export function LetterReveal({ segments, className, delay = 0.15, stagger = 0.022 }: {
  segments: (Segment | "br")[]; className?: string; delay?: number; stagger?: number;
}) {
  const reduce = useReducedMotion();
  const plain = segments.map((s) => (s === "br" ? " " : s.text)).join("");
  let i = 0;
  return (
    <h1 className={className} aria-label={plain}>
      <span aria-hidden>
        {segments.map((seg, si) => {
          if (seg === "br") return <br key={si} />;
          return (
            <span key={si} className={seg.className}>
              {seg.text.split(/(\s+)/).map((word, wi) =>
                /^\s+$/.test(word) ? (
                  <Fragment key={wi}>{word}</Fragment>
                ) : (
                  <span key={wi} className="inline-block whitespace-nowrap">
                    {word.split("").map((ch, ci) => {
                      const d = delay + i++ * stagger;
                      return reduce ? (
                        <span key={ci} style={{ color: seg.color }}>{ch}</span>
                      ) : (
                        <motion.span
                          key={ci}
                          className="inline-block"
                          initial={{ opacity: 0, filter: "blur(10px)", y: "0.18em", color: "#4C7DFF" }}
                          animate={{ opacity: 1, filter: "blur(0px)", y: 0, color: seg.color ?? "var(--lr-final, currentColor)" }}
                          transition={{ duration: 0.75, delay: d, ease: [0.22, 0.7, 0.2, 1], color: { duration: 0.9, delay: d + 0.25 } }}
                        >
                          {ch}
                        </motion.span>
                      );
                    })}
                  </span>
                )
              )}
            </span>
          );
        })}
      </span>
    </h1>
  );
}
