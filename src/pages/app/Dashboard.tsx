import { Activity, ArrowRight, Bot, CheckCircle2, Gauge, Plus, Workflow } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip, axisProps, shortDate } from "@/components/app/ChartTooltip";
import { PageHeader } from "@/components/app/PageHeader";
import { StatCard } from "@/components/app/StatCard";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { generateDaily, systemHealth } from "@/data/appMock";
import { cn, formatCompact, formatNumber, timeAgo } from "@/lib/utils";
import { useAppStore, useSimulatedLoad } from "@/store/AppStore";
import { chartPalette } from "@/styles/tokens";

export default function Dashboard() {
  const { agents, workflows, logs, settings } = useAppStore();
  const loading = useSimulatedLoad(700);
  const daily = useMemo(() => generateDaily(60), []);
  const last30 = daily.slice(-30), prev30 = daily.slice(0, 30);

  const sum = (a: typeof daily, k: "tasks" | "success" | "failed") => a.reduce((s, d) => s + d[k], 0);
  const tasks = sum(last30, "tasks"), tasksPrev = sum(prev30, "tasks");
  const rate = (sum(last30, "success") / tasks) * 100, ratePrev = (sum(prev30, "success") / tasksPrev) * 100;
  const active = agents.filter((a) => a.status === "active").length;
  const topAgents = [...agents].sort((a, b) => b.runs - a.runs).slice(0, 5);
  const maxRuns = topAgents[0]?.runs || 1;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHeader
        title={`${greet}, ${settings.profile.name.split(" ")[0]}`}
        description="Here's how your AI operations are running across the workspace."
        actions={<>
          <Button asChild variant="outline" size="sm"><Link to="/app/analytics">View analytics</Link></Button>
          <Button asChild variant="brand" size="sm"><Link to="/app/agents?new=1"><Plus className="h-4 w-4" />New agent</Link></Button>
        </>}
      />

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={loading} label={`Total AI agents · ${active} active`} value={String(agents.length)} icon={Bot} spark={[6, 6, 7, 7, 8, 8, 9, 9, 10, agents.length]} />
        <StatCard loading={loading} label="Active workflows" value={String(workflows.length + 6)} icon={Workflow} delta={12.5} spark={[4, 5, 5, 6, 6, 7, 7, 8]} color={chartPalette[2]} />
        <StatCard loading={loading} label="Tasks completed (30d)" value={formatCompact(sum(last30, "success"))} icon={CheckCircle2} delta={((tasks - tasksPrev) / tasksPrev) * 100} spark={last30.map((d) => d.success)} />
        <StatCard loading={loading} label="Automation success rate" value={`${rate.toFixed(1)}%`} icon={Gauge} delta={rate - ratePrev} spark={last30.map((d) => (d.success / d.tasks) * 100)} color={chartPalette[3]} />
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader>
            <div><CardTitle>Usage — tasks per day</CardTitle><CardDescription>Last 30 days, all agents</CardDescription></div>
            <Link to="/app/analytics" className="text-[12.5px] text-primary hover:underline">Details</Link>
          </CardHeader>
          <CardContent className="h-[280px]">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last30} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor={chartPalette[0]} stopOpacity={0.28} /><stop offset="1" stopColor={chartPalette[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="0" />
                  <XAxis dataKey="date" {...axisProps} tickFormatter={shortDate} minTickGap={32} />
                  <YAxis {...axisProps} tickFormatter={(v) => formatCompact(v)} width={44} />
                  <Tooltip content={<ChartTooltip labelFormat={shortDate} />} cursor={{ stroke: "hsl(var(--muted-foreground))", strokeDasharray: "3 3" }} />
                  <Area name="Tasks completed" dataKey="success" type="monotone" stroke={chartPalette[0]} strokeWidth={2} fill="url(#dash-area)" activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div><CardTitle>System health</CardTitle><CardDescription>Live service status</CardDescription></div>
            <span className="flex items-center gap-1.5 text-[12px] text-warning"><span className="h-1.5 w-1.5 rounded-full bg-warning" />1 degraded</span>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {systemHealth.map((s) => (
                <li key={s.name} className="flex items-center gap-3 py-2.5">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", s.status === "operational" ? "bg-success" : "bg-warning")} aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-[13px]">{s.name}</span>
                  <span className="sr-only">{s.status}</span>
                  <span className="font-mono text-[11.5px] text-muted-foreground">{s.latency}ms</span>
                  <span className={cn("w-14 text-right font-mono text-[11.5px]", s.uptime < 99.5 ? "text-warning" : "text-muted-foreground")}>{s.uptime}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.3fr]">
        <Card>
          <CardHeader><div><CardTitle>Top agents by runs</CardTitle><CardDescription>All-time execution volume</CardDescription></div></CardHeader>
          <CardContent>
            {loading ? <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8" />)}</div> : (
              <ul className="space-y-3.5">
                {topAgents.map((a) => (
                  <li key={a.id}>
                    <Link to={`/app/agents/${a.id}`} className="group block">
                      <div className="mb-1.5 flex items-center justify-between text-[13px]">
                        <span className="font-medium group-hover:text-primary">{a.name} <span className="font-normal text-muted-foreground">· {a.role}</span></span>
                        <span className="font-mono text-[12px] text-muted-foreground">{formatNumber(a.runs)}</span>
                      </div>
                      <Progress value={(a.runs / maxRuns) * 100} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div><CardTitle>Recent activity</CardTitle><CardDescription>Latest agent actions</CardDescription></div>
            <Link to="/app/activity" className="inline-flex items-center gap-1 text-[12.5px] text-primary hover:underline">All activity <ArrowRight className="h-3.5 w-3.5" /></Link>
          </CardHeader>
          <CardContent>
            {loading ? <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-9" />)}</div> : (
              <ul className="divide-y">
                {logs.slice(0, 7).map((l) => (
                  <li key={l.id} className="flex items-center gap-3 py-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border bg-muted/60"><Activity className="h-3.5 w-3.5 text-muted-foreground" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px]">{l.action}</p>
                      <p className="text-[11.5px] text-muted-foreground">{l.agent} · {l.workflow}</p>
                    </div>
                    <div className="hidden sm:block"><StatusBadge status={l.status} /></div>
                    <time dateTime={l.timestamp} className="w-14 shrink-0 text-right text-[11.5px] text-muted-foreground">{timeAgo(l.timestamp)}</time>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
