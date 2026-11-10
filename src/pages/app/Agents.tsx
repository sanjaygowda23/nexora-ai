import { AnimatePresence, motion } from "framer-motion";
import { Bot, Copy, Eye, LayoutGrid, List, MoreHorizontal, Pause, Play, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AgentForm, emptyAgent } from "@/components/app/AgentForm";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/states";
import { DEPARTMENTS, MODELS, type Agent, type AgentStatus } from "@/data/appMock";
import { cn, formatNumber, timeAgo } from "@/lib/utils";
import { useAppStore, useSimulatedLoad } from "@/store/AppStore";

const STATUSES: (AgentStatus | "all")[] = ["all", "active", "paused", "error", "draft"];
const toInput = (a: Agent) => ({
  name: a.name, role: a.role, description: a.description, status: a.status, model: a.model, department: a.department,
  temperature: a.temperature, approvalRequired: a.approvalRequired, tools: a.tools, owner: a.owner,
});
const modelLabel = (id: string) => MODELS.find((m) => m.id === id)?.label ?? id;

export default function Agents() {
  const { agents, createAgent, updateAgent, deleteAgent } = useAppStore();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const loading = useSimulatedLoad(500);
  const [pendingDelete, setPendingDelete] = useState<Agent | null>(null);

  const q = params.get("q") ?? "";
  const status = (params.get("status") ?? "all") as AgentStatus | "all";
  const dept = params.get("dept") ?? "all";
  const view = params.get("view") === "table" ? "table" : "grid";
  const sort = params.get("sort") ?? "runs";
  const creating = params.get("new") === "1";

  const set = (k: string, v: string | null) => {
    const next = new URLSearchParams(params);
    if (v === null || v === "" || v === "all") next.delete(k); else next.set(k, v);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = agents.filter((a) =>
      (status === "all" || a.status === status) &&
      (dept === "all" || a.department === dept) &&
      (!s || `${a.name} ${a.role} ${a.description} ${a.owner}`.toLowerCase().includes(s)));
    return [...list].sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "recent" ? b.lastRunAt.localeCompare(a.lastRunAt) : b.runs - a.runs);
  }, [agents, q, status, dept, sort]);

  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, s === "all" ? agents.length : agents.filter((a) => a.status === s).length])), [agents]);

  const toggle = (a: Agent) => {
    const next = a.status === "active" ? "paused" : "active";
    updateAgent(a.id, { status: next });
    toast.success(`${a.name} ${next === "active" ? "resumed" : "paused"}`);
  };
  const duplicate = (a: Agent) => {
    let name = `${a.name} copy`, n = 2;
    while (agents.some((x) => x.name === name)) name = `${a.name} copy ${n++}`;
    createAgent({ ...toInput(a), name, status: "draft" });
    toast.success(`Duplicated as “${name}”`);
  };
  const actions = (a: Agent) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${a.name}`} onClick={(e) => e.preventDefault()}><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => navigate(`/app/agents/${a.id}`)}><Eye />View details</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toggle(a)}>{a.status === "active" ? <><Pause />Pause agent</> : <><Play />Activate agent</>}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => duplicate(a)}><Copy />Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => setPendingDelete(a)}><Trash2 />Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <PageHeader title="AI agents" description="Create, configure and supervise the agents in your workspace."
        actions={<Button variant="brand" size="sm" onClick={() => set("new", "1")}><Plus className="h-4 w-4" />Create agent</Button>} />

      {/* Status tabs */}
      <div role="tablist" aria-label="Filter by status" className="mb-4 flex gap-1 overflow-x-auto border-b [scrollbar-width:none]">
        {STATUSES.map((s) => (
          <button key={s} role="tab" aria-selected={status === s} onClick={() => set("status", s)}
            className={cn("relative flex shrink-0 items-center gap-2 px-3 pb-2.5 pt-1 text-[13px] font-medium capitalize transition-colors", status === s ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {s}<span className="rounded-full bg-muted px-1.5 font-mono text-[10.5px] text-muted-foreground">{counts[s]}</span>
            {status === s && <motion.span layoutId="agent-tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => set("q", e.target.value)} placeholder="Search by name, role or owner…" className="pl-9" aria-label="Search agents" />
        </div>
        <div className="flex gap-2">
          <Select value={dept} onValueChange={(v) => set("dept", v)}>
            <SelectTrigger className="w-full sm:w-44" aria-label="Department"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All departments</SelectItem>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => set("sort", v === "runs" ? null : v)}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Sort"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="runs">Most runs</SelectItem><SelectItem value="recent">Recently active</SelectItem><SelectItem value="name">Name A–Z</SelectItem></SelectContent>
          </Select>
          <div className="hidden rounded-lg border p-0.5 sm:flex" role="group" aria-label="View">
            <Button variant="ghost" size="icon-sm" aria-pressed={view === "grid"} aria-label="Grid view" className={cn(view === "grid" && "bg-accent")} onClick={() => set("view", null)}><LayoutGrid className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon-sm" aria-pressed={view === "table"} aria-label="Table view" className={cn(view === "table" && "bg-accent")} onClick={() => set("view", "table")}><List className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[196px] rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Bot} title={agents.length ? "No agents match these filters" : "No agents yet"}
          description={agents.length ? "Try a different search term or clear the filters." : "Create your first agent to start automating work."}
          action={agents.length ? { label: "Clear filters", onClick: () => setParams({}, { replace: true }) } : { label: "Create agent", onClick: () => set("new", "1") }} />
      ) : view === "grid" ? (
        <motion.ul layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {filtered.map((a) => (
              <motion.li key={a.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }}>
                <Card className="group relative h-full p-5 transition-colors hover:border-primary/40">
                  <div className="flex items-start gap-3">
                    <AgentAvatar name={a.name} />
                    <div className="min-w-0 flex-1">
                      <Link to={`/app/agents/${a.id}`} className="font-semibold after:absolute after:inset-0 hover:text-primary">{a.name}</Link>
                      <p className="truncate text-[12.5px] text-muted-foreground">{a.role}</p>
                    </div>
                    <div className="relative z-10">{actions(a)}</div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{a.description}</p>
                  <div className="mt-4 flex items-center gap-2"><StatusBadge status={a.status} /><span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">{modelLabel(a.model)}</span><span className="text-[11.5px] text-muted-foreground">{a.department}</span></div>
                  <dl className="mt-4 grid grid-cols-3 border-t pt-3 text-[12px]">
                    <div><dt className="text-muted-foreground">Runs</dt><dd className="font-mono">{formatNumber(a.runs)}</dd></div>
                    <div><dt className="text-muted-foreground">Success</dt><dd className="font-mono">{a.runs ? `${a.successRate}%` : "—"}</dd></div>
                    <div><dt className="text-muted-foreground">Last run</dt><dd className="font-mono">{a.runs ? timeAgo(a.lastRunAt) : "never"}</dd></div>
                  </dl>
                </Card>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead><tr className="border-b text-left text-[12px] text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-medium">Agent</th><th scope="col" className="px-4 py-3 font-medium">Status</th><th scope="col" className="px-4 py-3 font-medium">Model</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Runs</th><th scope="col" className="px-4 py-3 text-right font-medium">Success</th><th scope="col" className="px-4 py-3 font-medium">Owner</th><th className="w-12" /></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3"><Link to={`/app/agents/${a.id}`} className="flex items-center gap-3 hover:text-primary"><AgentAvatar name={a.name} small /><span><span className="block font-medium">{a.name}</span><span className="text-[12px] text-muted-foreground">{a.role}</span></span></Link></td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">{modelLabel(a.model)}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatNumber(a.runs)}</td>
                  <td className="px-4 py-3 text-right font-mono">{a.runs ? `${a.successRate}%` : "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.owner}</td>
                  <td className="px-2">{actions(a)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Create */}
      <Dialog open={creating} onOpenChange={(o) => !o && set("new", null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Create an agent</DialogTitle><DialogDescription>Define what it does, which model it uses and which tools it may call.</DialogDescription></DialogHeader>
          <AgentForm defaultValues={emptyAgent} submitLabel="Create agent" takenNames={agents.map((a) => a.name)} onCancel={() => set("new", null)}
            onSubmit={(v) => {
              const a = createAgent({ ...v, owner: "Alex Morgan" });
              toast.success(`${a.name} created`, { description: "Saved as a draft. Activate it when you're ready.", action: { label: "Open", onClick: () => navigate(`/app/agents/${a.id}`) } });
              set("new", null);
            }} />
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete {pendingDelete?.name}?</DialogTitle><DialogDescription>The agent and its configuration will be removed from this workspace. Workflows that use it will need a new agent.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              const a = pendingDelete!; deleteAgent(a.id); setPendingDelete(null);
              toast(`${a.name} deleted`, { action: { label: "Undo", onClick: () => createAgent(toInput(a)) } });
            }}>Delete agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AgentAvatar({ name, small }: { name: string; small?: boolean }) {
  const hue = [...name].reduce((s, c) => s + c.charCodeAt(0), 0) % 4;
  const bg = ["bg-brand", "bg-[#536B5B]", "bg-[#586D79]", "bg-[#796B55]"][hue];
  return <span className={cn("grid shrink-0 place-items-center rounded-lg font-semibold text-white", bg, small ? "h-8 w-8 text-[12px]" : "h-10 w-10 text-[14px]")} aria-hidden>{name.slice(0, 2)}</span>;
}
