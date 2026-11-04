import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export function Progress({ value, className, indicatorClassName }: { value: number; className?: string; indicatorClassName?: string }) {
  return (
    <ProgressPrimitive.Root value={value} className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-full bg-primary transition-transform duration-700 ease-out", indicatorClassName)}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
