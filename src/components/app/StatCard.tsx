import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, delta, icon: Icon, spark, loading, color = "#4C7DFF", invertDelta }: {
  label: string; value: string; delta?: number; icon: LucideIcon; spark?: number[]; loading?: boolean; color?: string; invertDelta?: boolean;
}) {
  if (loading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-8 w-28" />
        <Skeleton className="mt-4 h-8 w-full" />
      </Card>
    );
  }
  const good = delta !== undefined && (invertDelta ? delta < 0 : delta >= 0);
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-lg border bg-muted/60"><Icon className="h-4 w-4 text-muted-foreground" /></span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <p className="text-[28px] font-semibold leading-none tracking-[-0.03em]">{value}</p>
        {delta !== undefined && (
          <span className={cn("mb-0.5 inline-flex items-center gap-0.5 text-[12px] font-medium", good ? "text-success" : "text-destructive")}>
            {delta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {spark && (
        <div className="-mx-5 -mb-5 mt-3 h-12" aria-hidden>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark.map((v, i) => ({ i, v }))} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`sp-${label.replace(/\W/g, "")}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={color} stopOpacity={0.3} /><stop offset="1" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area dataKey="v" type="monotone" stroke={color} strokeWidth={1.5} fill={`url(#sp-${label.replace(/\W/g, "")})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
