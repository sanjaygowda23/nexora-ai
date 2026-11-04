/** Themed Recharts tooltip: values in text ink, a coloured key carries identity. */
type Entry = { name?: string | number; value?: number | string; color?: string; dataKey?: string | number };
export function ChartTooltip({ active, payload, label, format = (v: number) => v.toLocaleString("en-US"), labelFormat }: {
  active?: boolean; payload?: Entry[]; label?: string | number; format?: (v: number) => string; labelFormat?: (l: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[160px] rounded-lg border bg-popover px-3 py-2.5 text-[12px] shadow-xl">
      <p className="mb-1.5 font-medium text-foreground">{labelFormat ? labelFormat(String(label)) : label}</p>
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={String(p.dataKey)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-muted-foreground"><span className="h-2 w-2 rounded-sm" style={{ background: p.color }} />{p.name}</span>
            <span className="font-mono text-foreground">{format(Number(p.value))}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const axisProps = {
  stroke: "hsl(var(--muted-foreground))",
  tick: { fill: "hsl(var(--muted-foreground))", fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

export const shortDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
