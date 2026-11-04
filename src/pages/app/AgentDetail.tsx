import { ArrowLeft, Clock, Coins, FlaskConical as Run, Gauge, Pause, Play, ShieldCheck, Trash2, Wrench, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { AgentForm, toFormValues } from "@/components/app/AgentForm";
import { ChartTooltip, axisProps, shortDate } from "@/components/app/ChartTooltip";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MODELS } from "@/data/appMock";
import { formatDateTime, formatNumber, seeded, timeAgo } from "@/lib/utils";
import { useAppStore } from "@/store/AppStore";
import { chartPalette } from "@/styles/tokens";
import { AgentAvatar } from "./Agents";

export default function AgentDetail() {
  const { id } = useParams();
  const { agents, updateAgent, deleteAgent, logs, pushLog } = useAppStore();
  const navigate = useNavigate();
  const agent = agents.find((a) => a.id === id);
  const [confirm, setConfirm] = useState(false);
  const [testing, setTesting] = useState(false);

  const daily = useMemo(() => {
    if (!agent) return [];
    const rnd = seeded(agent.name.length * 97 + agent.runs);
    const base = agent.runs / 90;
    return Array.from({ length: 14 }, (_, i) => {
      const runs = agent.runs ? Math.round(base * (0.7 + rnd() * 0.6)) : 0;
      const failed = Math.round(runs * (1 - agent.successRate / 100) * (0.6 + rnd() * 0.8));
      return { date: new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10), succeeded: runs - failed, failed };
    });
  }, [agent]);

  if (!agent) {
    return <EmptyState title="Agent not found" description="It may have been deleted or the link is incorrect." action={{ label: "Back to agents", onClick: () => navigate("/app/agents") }} className="mt-10" />;
  }
  const agentLogs = logs.filter((l) => l.agent === agent.name).slice(0, 8);

  const testRun = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      const ok = agent.status !== "error";
      pushLog({ agent: agent.name, workflow: "Manual test", action: ok ? "Test run completed" : "Test run failed: tool timeout", status: ok ? "success" : "failed", durationMs: 1840, tokens: 1260 });
      updateAgent(agent.id, { runs: agent.runs + 1, lastRunAt: new Date().toISOString() });
      ok ? toast.success("Test run succeeded", { description: "1.8s · 1,260 tokens · see Activity for the trace" }) : toast.error("Test run failed", { description: "Monitoring API timed out. Check the connector." });
    }, 1600);
  };

  return (
    <>
      <Link to="/app/agents" className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />All agents</Link>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <AgentAvatar name={agent.name} />
          <div>
            <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-semibold tracking-[-0.03em]">{agent.name}</h1><StatusBadge status={agent.status} /></div>
            <p className="text-[13.5px] text-muted-foreground">{agent.role} · {agent.department} · owned by {agent.owner}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={testRun} disabled={testing}><Run className="h-4 w-4" />{testing ? "Running…" : "Test run"}</Button>
          <Button variant="outline" size="sm" onClick={() => { const s = agent.status === "active" ? "paused" : "active"; updateAgent(agent.id, { status: s }); toast.success(`${agent.name} ${s === "active" ? "activated" : "paused"}`); }}>
            {agent.status === "active" ? <><Pause className="h-4 w-4" />Pause</> : <><Play className="h-4 w-4" />Activate</>}
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setConfirm(true)}><Trash2 className="h-4 w-4" />Delete</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-5"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="config">Configuration</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>

        <TabsContent value="overview" className="space-y-4">
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[[Zap, "Total runs", formatNumber(agent.runs)], [Gauge, "Success rate", agent.runs ? `${agent.successRate}%` : "—"], [Clock, "Avg latency", agent.avgLatencyMs ? `${(agent.avgLatencyMs / 1000).toFixed(1)}s` : "—"], [Coins, "Spend (30d)", `$${formatNumber(agent.costUsd)}`]].map(([I, k, v]) => {
              const Icon = I as typeof Zap;
              return <Card key={k as string} className="p-4"><dt className="flex items-center gap-2 text-[12.5px] text-muted-foreground"><Icon className="h-3.5 w-3.5" />{k as string}</dt><dd className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{v as string}</dd></Card>;
            })}
          </dl>
          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <Card>
              <CardHeader><div><CardTitle>Executions — last 14 days</CardTitle><CardDescription>Succeeded and failed runs per day</CardDescription></div></CardHeader>
              <CardContent className="h-[260px]">
                {agent.runs === 0 ? <EmptyState title="No runs yet" description="Activate this agent or run a test to see execution data." className="h-full py-6" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={daily} margin={{ top: 8, right: 4, left: -16, bottom: 0 }} barCategoryGap="28%">
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" {...axisProps} tickFormatter={shortDate} minTickGap={20} />
                      <YAxis {...axisProps} width={40} />
                      <Tooltip content={<ChartTooltip labelFormat={shortDate} />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
                      <Bar dataKey="succeeded" name="Succeeded" stackId="a" fill={chartPalette[0]} stroke="hsl(var(--card))" strokeWidth={1} />
                      <Bar dataKey="failed" name="Failed" stackId="a" fill={chartPalette[1]} radius={[4, 4, 0, 0]} stroke="hsl(var(--card))" strokeWidth={1} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <div className="flex gap-4 px-5 pb-4 text-[12px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: chartPalette[0] }} />Succeeded</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: chartPalette[1] }} />Failed</span>
              </div>
            </Card>
            <Card>
              <CardHeader><div><CardTitle>Configuration summary</CardTitle><CardDescription>{agent.description}</CardDescription></div></CardHeader>
              <CardContent className="space-y-4 text-[13px]">
                <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Model</span><span className="font-mono">{MODELS.find((m) => m.id === agent.model)?.label}</span></div>
                <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Temperature</span><span className="font-mono">{agent.temperature.toFixed(2)}</span></div>
                <div className="flex justify-between border-b pb-3"><span className="flex items-center gap-1.5 text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" />Human approval</span><span>{agent.approvalRequired ? "Required" : "Not required"}</span></div>
                <div><p className="mb-2 flex items-center gap-1.5 text-muted-foreground"><Wrench className="h-3.5 w-3.5" />Tools</p><div className="flex flex-wrap gap-1.5">{agent.tools.map((t) => <span key={t} className="rounded-md border bg-muted/50 px-2 py-1 text-[12px]">{t}</span>)}</div></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <Card className="max-w-3xl p-6">
            <AgentForm key={agent.id + agent.name} defaultValues={toFormValues(agent)} submitLabel="Save changes" takenNames={agents.filter((a) => a.id !== agent.id).map((a) => a.name)}
              onSubmit={(v) => { updateAgent(agent.id, v); toast.success("Configuration saved"); }} />
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            {agentLogs.length === 0 ? <EmptyState title="No activity yet" description="Runs will appear here as soon as this agent executes." className="m-5" /> : (
              <ul className="divide-y">
                {agentLogs.map((l) => (
                  <li key={l.id} className="flex flex-wrap items-center gap-3 px-5 py-3 text-[13px]">
                    <StatusBadge status={l.status} />
                    <span className="min-w-0 flex-1 truncate">{l.action}</span>
                    <span className="font-mono text-[12px] text-muted-foreground">{(l.durationMs / 1000).toFixed(1)}s</span>
                    <time className="w-28 text-right text-[12px] text-muted-foreground" title={formatDateTime(l.timestamp)}>{timeAgo(l.timestamp)}</time>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete {agent.name}?</DialogTitle><DialogDescription>This removes the agent from the workspace. This demo action can't be undone from this page.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { deleteAgent(agent.id); toast(`${agent.name} deleted`); navigate("/app/agents"); }}>Delete agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
