import { motion } from "framer-motion";
import { Fragment } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

type Segment = { text: string; className?: string; color?: string };

/**
 * Headline that resolves letter by letter: ghost → blurred → brand → final colour.
 * Words never break mid-word; screen readers get the plain sentence via aria-label.
 */
export function LetterReveal({ segments, className, delay = 0.05, stagger = 0.006 }: {
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
                          initial={{ opacity: 0.6, y: "0.06em" }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ color: seg.color }}
                          transition={{ duration: 0.4, delay: d, ease: [0.22, 0.7, 0.2, 1] }}
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
