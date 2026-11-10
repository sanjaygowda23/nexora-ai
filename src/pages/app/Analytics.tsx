import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";
import { toast } from "sonner";
import { ChartTooltip, axisProps, shortDate } from "@/components/app/ChartTooltip";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateDaily } from "@/data/appMock";
import { cn, formatCompact, formatNumber } from "@/lib/utils";
import { useAppStore, useSimulatedLoad } from "@/store/AppStore";
import { chartPalette } from "@/styles/tokens";

const ALL = generateDaily(90);
const PRESETS = [{ id: "7d", days: 7 }, { id: "30d", days: 30 }, { id: "90d", days: 90 }] as const;
const iso = (d: Date) => d.toISOString().slice(0, 10);

export default function Analytics() {
  const { agents } = useAppStore();
  const [params, setParams] = useSearchParams();
  const range = params.get("range") ?? "30d";
  const [from, setFrom] = useState(params.get("from") ?? ALL[ALL.length - 30].date);
  const [to, setTo] = useState(params.get("to") ?? ALL[ALL.length - 1].date);
  const loading = useSimulatedLoad(550, [range, from, to]);

  const data = useMemo(() => {
    if (range === "custom") return ALL.filter((d) => d.date >= from && d.date <= to);
    const days = PRESETS.find((p) => p.id === range)?.days ?? 30;
    return ALL.slice(-days);
  }, [range, from, to]);

  const weekly = useMemo(() => {
    if (data.length <= 14) return data.map((d) => ({ label: shortDate(d.date), succeeded: d.success, failed: d.failed }));
    const out: { label: string; succeeded: number; failed: number }[] = [];
    for (let i = 0; i < data.length; i += 7) {
      const w = data.slice(i, i + 7);
      out.push({ label: `Wk of ${shortDate(w[0].date)}`, succeeded: w.reduce((s, d) => s + d.success, 0), failed: w.reduce((s, d) => s + d.failed, 0) });
    }
    return out;
  }, [data]);

  const totals = useMemo(() => {
    const tasks = data.reduce((s, d) => s + d.tasks, 0);
    const success = data.reduce((s, d) => s + d.success, 0);
    const cost = data.reduce((s, d) => s + d.cost, 0);
    const lat = data.length ? data.reduce((s, d) => s + d.latency, 0) / data.length : 0;
    return { tasks, rate: tasks ? (success / tasks) * 100 : 0, cost, lat };
  }, [data]);

  const agentStats = useMemo(() => {
    const share = data.length / 90;
    return agents.filter((a) => a.runs > 0).map((a) => ({ name: a.name, runs: Math.round(a.runs * share), success: a.successRate, latency: a.avgLatencyMs, cost: Math.round(a.costUsd * share) })).sort((a, b) => b.runs - a.runs);
  }, [agents, data.length]);

  const setRange = (r: string) => { const p = new URLSearchParams(params); p.set("range", r); if (r !== "custom") { p.delete("from"); p.delete("to"); } setParams(p, { replace: true }); };
  const applyCustom = (f: string, t: string) => {
    if (f > t) return toast.error("Start date must be before end date.");
    setFrom(f); setTo(t);
    setParams({ range: "custom", from: f, to: t }, { replace: true });
  };

  const exportCsv = () => {
    const rows = ["date,tasks,succeeded,failed,cost_usd,latency_ms", ...data.map((d) => `${d.date},${d.tasks},${d.success},${d.failed},${d.cost},${d.latency}`)];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `alder-usage-${data[0]?.date}_${data[data.length - 1]?.date}.csv` });
    a.click(); URL.revokeObjectURL(url);
    toast.success("CSV exported", { description: `${data.length} days of usage data` });
  };

  return (
    <>
      <PageHeader title="Analytics" description="Usage, performance and cost across agents and workflows."
        actions={<Button variant="outline" size="sm" onClick={exportCsv} disabled={!data.length}><Download className="h-4 w-4" />Export CSV</Button>} />

      {/* Filters — one row above all charts */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div role="radiogroup" aria-label="Date range" className="inline-flex rounded-lg border bg-muted/40 p-1">
          {[...PRESETS.map((p) => p.id), "custom"].map((r) => (
            <button key={r} role="radio" aria-checked={range === r} onClick={() => setRange(r)}
              className={cn("rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors", range === r ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              {r === "custom" ? "Custom" : `Last ${r.replace("d", " days")}`}
            </button>
          ))}
        </div>
        {range === "custom" && (
          <div className="flex items-center gap-2">
            <Input type="date" aria-label="From" value={from} min={ALL[0].date} max={to} onChange={(e) => applyCustom(e.target.value, to)} className="h-9 w-40" />
            <span className="text-muted-foreground">–</span>
            <Input type="date" aria-label="To" value={to} min={from} max={iso(new Date())} onChange={(e) => applyCustom(from, e.target.value)} className="h-9 w-40" />
          </div>
        )}
        <p className="text-[12.5px] text-muted-foreground md:ml-auto">{data.length} days · {data[0] && shortDate(data[0].date)} – {data.at(-1) && shortDate(data.at(-1)!.date)}</p>
      </div>

      {/* KPI row */}
      <dl className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Tasks executed", formatCompact(totals.tasks)], ["Success rate", `${totals.rate.toFixed(1)}%`], ["AI spend", `$${formatNumber(Math.round(totals.cost))}`], ["Avg latency", `${(totals.lat / 1000).toFixed(2)}s`]].map(([k, v]) => (
          <Card key={k} className="p-4">{loading ? <><Skeleton className="h-4 w-20" /><Skeleton className="mt-3 h-7 w-24" /></> : <><dt className="text-[12.5px] text-muted-foreground">{k}</dt><dd className="mt-1.5 text-2xl font-semibold tracking-[-0.03em]">{v}</dd></>}</Card>
        ))}
      </dl>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="xl:col-span-2">
          <Tabs defaultValue="chart">
            <CardHeader>
              <div><CardTitle>Usage trend</CardTitle><CardDescription>Tasks executed per day</CardDescription></div>
              <TabsList><TabsTrigger value="chart">Chart</TabsTrigger><TabsTrigger value="table">Table</TabsTrigger></TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="chart" className="h-[300px]">
                {loading ? <Skeleton className="h-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                      <defs><linearGradient id="an-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={chartPalette[0]} stopOpacity={0.25} /><stop offset="1" stopColor={chartPalette[0]} stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" {...axisProps} tickFormatter={shortDate} minTickGap={30} />
                      <YAxis {...axisProps} tickFormatter={formatCompact} width={44} />
                      <Tooltip content={<ChartTooltip labelFormat={shortDate} />} cursor={{ stroke: "hsl(var(--muted-foreground))", strokeDasharray: "3 3" }} />
                      <Area name="Tasks" dataKey="tasks" type="monotone" stroke={chartPalette[0]} strokeWidth={2} fill="url(#an-area)" activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </TabsContent>
              <TabsContent value="table" className="max-h-[300px] overflow-auto">
                <table className="w-full text-[13px]">
                  <thead className="sticky top-0 bg-card"><tr className="border-b text-left text-[12px] text-muted-foreground"><th className="py-2 font-medium">Date</th><th className="py-2 text-right font-medium">Tasks</th><th className="py-2 text-right font-medium">Succeeded</th><th className="py-2 text-right font-medium">Failed</th><th className="py-2 text-right font-medium">Cost</th></tr></thead>
                  <tbody>{[...data].reverse().map((d) => <tr key={d.date} className="border-b last:border-0"><td className="py-2">{shortDate(d.date)}</td><td className="py-2 text-right font-mono">{formatNumber(d.tasks)}</td><td className="py-2 text-right font-mono">{formatNumber(d.success)}</td><td className="py-2 text-right font-mono">{formatNumber(d.failed)}</td><td className="py-2 text-right font-mono">${d.cost.toFixed(0)}</td></tr>)}</tbody>
                </table>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <Card>
          <CardHeader><div><CardTitle>Workflow performance</CardTitle><CardDescription>Succeeded vs failed runs {data.length > 14 ? "per week" : "per day"}</CardDescription></div></CardHeader>
          <CardContent className="h-[280px]">
            {loading ? <Skeleton className="h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly} margin={{ top: 8, right: 4, left: -10, bottom: 0 }} barCategoryGap="24%">
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" {...axisProps} minTickGap={12} tickFormatter={(l: string) => l.replace("Wk of ", "")} />
                  <YAxis {...axisProps} tickFormatter={formatCompact} width={44} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
                  <Bar dataKey="succeeded" name="Succeeded" stackId="r" fill={chartPalette[0]} stroke="hsl(var(--card))" strokeWidth={1} />
                  <Bar dataKey="failed" name="Failed" stackId="r" fill={chartPalette[1]} stroke="hsl(var(--card))" strokeWidth={1} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
          <Legend items={[["Succeeded", chartPalette[0]], ["Failed", chartPalette[1]]]} />
        </Card>

        <Card>
          <CardHeader><div><CardTitle>Agent execution statistics</CardTitle><CardDescription>Runs in the selected range</CardDescription></div></CardHeader>
          <CardContent className="h-[280px]">
            {loading ? <Skeleton className="h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentStats} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }} barCategoryGap="22%">
                  <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" {...axisProps} tickFormatter={formatCompact} />
                  <YAxis type="category" dataKey="name" {...axisProps} width={68} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
                  <Bar dataKey="runs" name="Runs" fill={chartPalette[2]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div><CardTitle>AI spend</CardTitle><CardDescription>USD per day</CardDescription></div></CardHeader>
          <CardContent className="h-[220px]">
            {loading ? <Skeleton className="h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" {...axisProps} tickFormatter={shortDate} minTickGap={30} />
                  <YAxis {...axisProps} tickFormatter={(v) => `$${v}`} width={48} />
                  <Tooltip content={<ChartTooltip labelFormat={shortDate} format={(v) => `$${v.toFixed(2)}`} />} />
                  <Line dataKey="cost" name="Spend" type="monotone" stroke={chartPalette[1]} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div><CardTitle>Latency</CardTitle><CardDescription>Average end-to-end, milliseconds</CardDescription></div></CardHeader>
          <CardContent className="h-[220px]">
            {loading ? <Skeleton className="h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" {...axisProps} tickFormatter={shortDate} minTickGap={30} />
                  <YAxis {...axisProps} width={48} domain={["dataMin - 100", "dataMax + 100"]} tickFormatter={(v) => `${Math.round(v)}`} />
                  <Tooltip content={<ChartTooltip labelFormat={shortDate} format={(v) => `${v} ms`} />} />
                  <Line dataKey="latency" name="Latency" type="monotone" stroke={chartPalette[3]} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 overflow-x-auto">
        <CardHeader><div><CardTitle>Agent breakdown</CardTitle><CardDescription>Execution, quality and cost per agent</CardDescription></div></CardHeader>
        <table className="w-full min-w-[640px] text-[13px]">
          <thead><tr className="border-y text-left text-[12px] text-muted-foreground"><th scope="col" className="px-5 py-2.5 font-medium">Agent</th><th scope="col" className="px-5 py-2.5 text-right font-medium">Runs</th><th scope="col" className="px-5 py-2.5 font-medium">Success rate</th><th scope="col" className="px-5 py-2.5 text-right font-medium">Avg latency</th><th scope="col" className="px-5 py-2.5 text-right font-medium">Spend</th></tr></thead>
          <tbody>
            {agentStats.map((a) => (
              <tr key={a.name} className="border-b last:border-0 hover:bg-muted/40">
                <td className="px-5 py-2.5 font-medium">{a.name}</td>
                <td className="px-5 py-2.5 text-right font-mono">{formatNumber(a.runs)}</td>
                <td className="px-5 py-2.5"><div className="flex items-center gap-2"><div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${a.success}%` }} /></div><span className="font-mono text-[12px]">{a.success}%</span></div></td>
                <td className="px-5 py-2.5 text-right font-mono">{(a.latency / 1000).toFixed(1)}s</td>
                <td className="px-5 py-2.5 text-right font-mono">${formatNumber(a.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="flex gap-4 px-5 pb-4 text-[12px] text-muted-foreground">
      {items.map(([l, c]) => <span key={l} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: c }} />{l}</span>)}
    </div>
  );
}
