import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({ title, description, align = "left", tone = "dark", className }: {
  index?: string; eyebrow: string; title: React.ReactNode; description?: React.ReactNode;
  align?: "left" | "center"; tone?: "dark" | "light"; className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <h2 className={cn("mt-5 text-display-lg font-medium", tone === "light" ? "text-ink-950" : "text-white")}>{title}</h2>
      {description && (
        <p className={cn("mt-5 max-w-2xl text-[17px] leading-relaxed", align === "center" && "mx-auto", tone === "light" ? "text-ink-600" : "text-ink-400")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
