import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({ index, eyebrow, title, description, align = "left", tone = "dark", className }: {
  index?: string; eyebrow: string; title: React.ReactNode; description?: React.ReactNode;
  align?: "left" | "center"; tone?: "dark" | "light"; className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center", tone === "light" && "text-ink-500")}>
        {index && <span className={tone === "light" ? "text-electric-600" : "text-signal"}>{index}</span>}
        <span className={cn("h-px w-6", tone === "light" ? "bg-ink-300" : "bg-white/20")} aria-hidden />
        {eyebrow}
      </p>
      <h2 className={cn("mt-5 text-display-lg font-medium", tone === "light" ? "text-ink-950" : "text-white")}>{title}</h2>
      {description && (
        <p className={cn("mt-5 max-w-2xl text-[17px] leading-relaxed", align === "center" && "mx-auto", tone === "light" ? "text-ink-500" : "text-ink-400")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
