import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/states";
import type { ActivityLog, LogStatus } from "@/data/appMock";
import { cn, formatDateTime, formatNumber, timeAgo } from "@/lib/utils";
import { useAppStore, useSimulatedLoad } from "@/store/AppStore";

const STATUSES: (LogStatus | "all")[] = ["all", "success", "warning", "failed", "running"];

/** Build a compact page list: 1 … 4 5 6 … 20 */
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => { if (i && p - sorted[i - 1] > 1) out.push("…"); out.push(p); });
  return out;
}

export default function ActivityLogs() {
  const { logs } = useAppStore();
  const [params, setParams] = useSearchParams();
  const [qInput, setQInput] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState<ActivityLog | null>(null);

  const q = params.get("q") ?? "";
  const status = (params.get("status") ?? "all") as LogStatus | "all";
  const agent = params.get("agent") ?? "all";
  const pageSize = Number(params.get("size") ?? 15);
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const loading = useSimulatedLoad(350, [q, status, agent, page, pageSize]);

  const set = (patch: Record<string, string | null>, resetPage = true) => {
    const p = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v === null || v === "" || v === "all" ? p.delete(k) : p.set(k, v)));
    if (resetPage) p.delete("page");
    setParams(p, { replace: true });
  };

  // Debounced search → URL
  useEffect(() => {
    const t = setTimeout(() => { if (qInput !== q) set({ q: qInput }); }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput]);

  const agents = useMemo(() => [...new Set(logs.map((l) => l.agent))].sort(), [logs]);
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return logs.filter((l) => (status === "all" || l.status === status) && (agent === "all" || l.agent === agent) &&
      (!s || `${l.action} ${l.agent} ${l.workflow} ${l.id}`.toLowerCase().includes(s)));
  }, [logs, q, status, agent]);
  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, s === "all" ? logs.length : logs.filter((l) => l.status === s).length])), [logs]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * pageSize, current * pageSize);
  const goto = (p: number) => set({ page: p === 1 ? null : String(p) }, false);
  const hasFilters = q || status !== "all" || agent !== "all";

  return (
    <>
      <PageHeader title="Activity logs" description="Every agent action and workflow run, with timestamps and status." />

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {STATUSES.map((s) => (
          <button key={s} aria-pressed={status === s} onClick={() => set({ status: s })}
            className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] font-medium capitalize transition-colors", status === s ? "border-primary bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {s}<span className="font-mono text-[11px] opacity-70">{formatNumber(counts[s])}</span>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="Search actions, agents, workflows or IDs…" className="pl-9 pr-9" aria-label="Search activity" />
          {qInput && <button onClick={() => { setQInput(""); set({ q: null }); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-accent" aria-label="Clear search"><X className="h-3.5 w-3.5" /></button>}
        </div>
        <Select value={agent} onValueChange={(v) => set({ agent: v })}>
          <SelectTrigger className="sm:w-48" aria-label="Agent"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All agents</SelectItem>{agents.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
        </Select>
        {hasFilters && <Button variant="ghost" onClick={() => { setQInput(""); setParams({}, { replace: true }); }}>Reset</Button>}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13px]">
            <caption className="sr-only">Activity log, page {current} of {totalPages}</caption>
            <thead><tr className="border-b bg-muted/30 text-left text-[12px] text-muted-foreground">
              <th scope="col" className="px-4 py-2.5 font-medium">Timestamp</th><th scope="col" className="px-4 py-2.5 font-medium">Action</th><th scope="col" className="px-4 py-2.5 font-medium">Agent</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Workflow</th><th scope="col" className="px-4 py-2.5 font-medium">Status</th><th scope="col" className="px-4 py-2.5 text-right font-medium">Duration</th></tr></thead>
            <tbody>
              {loading ? Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={6} className="px-4 py-3"><Skeleton className="h-5" /></td></tr>
              )) : rows.map((l) => (
                <tr key={l.id} className="cursor-pointer border-b last:border-0 hover:bg-muted/40 focus-within:bg-muted/40" onClick={() => setOpen(l)}>
                  <td className="whitespace-nowrap px-4 py-2.5"><time dateTime={l.timestamp} className="font-mono text-[12px]">{formatDateTime(l.timestamp)}</time><span className="ml-2 text-[11.5px] text-muted-foreground">{timeAgo(l.timestamp)}</span></td>
                  <td className="max-w-[320px] px-4 py-2.5"><button className="truncate text-left hover:text-primary focus-visible:text-primary" onClick={(e) => { e.stopPropagation(); setOpen(l); }}>{l.action}</button></td>
                  <td className="px-4 py-2.5">{l.agent}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{l.workflow}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-2.5 text-right font-mono text-[12px]">{(l.durationMs / 1000).toFixed(2)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && rows.length === 0 && <EmptyState title="No activity matches" description="Try a different search or clear the filters." className="m-4" action={{ label: "Clear filters", onClick: () => { setQInput(""); setParams({}, { replace: true }); } }} />}

        <nav aria-label="Pagination" className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
          <div className="flex items-center gap-3 text-[12.5px] text-muted-foreground">
            <span>{filtered.length ? `${(current - 1) * pageSize + 1}–${Math.min(current * pageSize, filtered.length)} of ${formatNumber(filtered.length)}` : "0 results"}</span>
            <Select value={String(pageSize)} onValueChange={(v) => set({ size: v === "15" ? null : v })}>
              <SelectTrigger className="h-8 w-[104px] text-[12.5px]" aria-label="Rows per page"><SelectValue /></SelectTrigger>
              <SelectContent>{[15, 30, 50].map((n) => <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" disabled={current <= 1} onClick={() => goto(current - 1)} aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></Button>
            {pageList(current, totalPages).map((p, i) => p === "…"
              ? <span key={`e${i}`} className="px-1 text-muted-foreground">…</span>
              : <Button key={p} variant={p === current ? "outline" : "ghost"} size="icon-sm" aria-current={p === current ? "page" : undefined} onClick={() => goto(p)} className="font-mono text-[12px]">{p}</Button>)}
            <Button variant="ghost" size="icon-sm" disabled={current >= totalPages} onClick={() => goto(current + 1)} aria-label="Next page"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </nav>
      </Card>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg">
          {open && (
            <>
              <DialogHeader><DialogTitle className="pr-6">{open.action}</DialogTitle><DialogDescription>{open.id} · {formatDateTime(open.timestamp)}</DialogDescription></DialogHeader>
              <dl className="grid grid-cols-2 gap-3 text-[13px]">
                {[["Status", <StatusBadge key="s" status={open.status} />], ["Agent", open.agent], ["Workflow", open.workflow], ["Duration", `${(open.durationMs / 1000).toFixed(2)}s`], ["Tokens", formatNumber(open.tokens)], ["Est. cost", `$${(open.tokens * 0.000004).toFixed(4)}`]].map(([k, v]) => (
                  <div key={k as string} className="rounded-lg border p-3"><dt className="text-[11.5px] text-muted-foreground">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>
                ))}
              </dl>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[11.5px] leading-relaxed text-muted-foreground">{JSON.stringify({ trace_id: open.id.replace("log", "trc"), steps: [{ step: "plan", ms: Math.round(open.durationMs * 0.15) }, { step: "tool_call", ms: Math.round(open.durationMs * 0.55) }, { step: "respond", ms: Math.round(open.durationMs * 0.3) }], policy: "default-v3", status: open.status }, null, 2)}</pre>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
