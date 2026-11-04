import { Copy, MoreHorizontal, Plus, Search, Trash2, Workflow as WorkflowIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusBadge } from "@/components/app/StatusBadge";
import { KIND_META } from "@/components/app/workflow/meta";
import { initialWorkflows, type SavedWorkflow } from "@/components/app/workflow/templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/states";
import { cn, timeAgo, uid } from "@/lib/utils";
import { useAppStore, useSimulatedLoad } from "@/store/AppStore";

/** Tiny SVG thumbnail of the graph, derived from real node positions. */
function GraphPreview({ wf }: { wf: SavedWorkflow }) {
  if (!wf.nodes.length) return <div className="grid h-full place-items-center text-[12px] text-muted-foreground">Empty canvas</div>;
  const xs = wf.nodes.map((n) => n.position.x), ys = wf.nodes.map((n) => n.position.y);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  const w = Math.max(...xs) - minX + 220, h = Math.max(...ys) - minY + 80;
  const pos = Object.fromEntries(wf.nodes.map((n) => [n.id, { x: n.position.x - minX, y: n.position.y - minY }]));
  return (
    <svg viewBox={`-20 -20 ${w + 40} ${h + 40}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {wf.edges.map((e) => {
        const a = pos[e.source], b = pos[e.target];
        if (!a || !b) return null;
        const x1 = a.x + 220, y1 = a.y + 36, x2 = b.x, y2 = b.y + 36, mx = (x1 + x2) / 2;
        return <path key={e.id} d={`M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} fill="none" stroke="hsl(var(--muted-foreground))" strokeOpacity=".45" strokeWidth="5" />;
      })}
      {wf.nodes.map((n) => (
        <g key={n.id} transform={`translate(${pos[n.id].x} ${pos[n.id].y})`}>
          <rect width="220" height="72" rx="14" fill="hsl(var(--card))" stroke={KIND_META[n.data.kind].color} strokeWidth="4" />
          <rect x="16" y="22" width="28" height="28" rx="6" fill={KIND_META[n.data.kind].color} opacity=".85" />
          <rect x="58" y="26" width="120" height="9" rx="4" fill="hsl(var(--foreground))" opacity=".55" />
          <rect x="58" y="42" width="80" height="7" rx="3" fill="hsl(var(--muted-foreground))" opacity=".45" />
        </g>
      ))}
    </svg>
  );
}

export default function Workflows() {
  const { workflows, saveWorkflow, deleteWorkflow } = useAppStore();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const loading = useSimulatedLoad(450);
  const [q, setQ] = useState("");
  const [newName, setNewName] = useState("");
  const [template, setTemplate] = useState<"blank" | string>("blank");
  const [err, setErr] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<SavedWorkflow | null>(null);
  const creating = params.get("new") === "1";
  const closeCreate = () => { params.delete("new"); setParams(params, { replace: true }); setErr(null); setNewName(""); };

  const list = useMemo(() => workflows.filter((w) => `${w.name} ${w.description}`.toLowerCase().includes(q.toLowerCase())), [workflows, q]);

  const create = () => {
    const name = newName.trim();
    if (name.length < 3) return setErr("Give your workflow a name (3+ characters).");
    if (workflows.some((w) => w.name.toLowerCase() === name.toLowerCase())) return setErr("A workflow with this name already exists.");
    const tpl = initialWorkflows.find((w) => w.id === template);
    const wf: SavedWorkflow = { id: uid("wf"), name, description: tpl ? `Based on “${tpl.name}”` : "New workflow", nodes: tpl ? structuredClone(tpl.nodes) : [], edges: tpl ? structuredClone(tpl.edges) : [], updatedAt: new Date().toISOString() };
    saveWorkflow(wf);
    closeCreate();
    navigate(`/app/workflows/${wf.id}`);
  };

  return (
    <>
      <PageHeader title="Workflows" description="Orchestrate triggers, AI steps, conditions and actions into automated processes."
        actions={<Button variant="brand" size="sm" onClick={() => setParams({ new: "1" })}><Plus className="h-4 w-4" />New workflow</Button>} />
      <div className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search workflows…" className="pl-9" aria-label="Search workflows" />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState icon={WorkflowIcon} title={q ? "No workflows match your search" : "No workflows yet"} description={q ? "Try another term." : "Create one from scratch or start from a template."}
          action={q ? { label: "Clear search", onClick: () => setQ("") } : { label: "New workflow", onClick: () => setParams({ new: "1" }) }} />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((w) => (
            <li key={w.id}>
              <Card className="group relative overflow-hidden transition-colors hover:border-primary/40">
                <div className="h-40 border-b bg-[radial-gradient(hsl(var(--muted-foreground)/0.2)_1px,transparent_1px)] bg-muted/30 p-4 [background-size:14px_14px]"><GraphPreview wf={w} /></div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link to={`/app/workflows/${w.id}`} className="font-semibold after:absolute after:inset-0 hover:text-primary">{w.name}</Link>
                      <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted-foreground">{w.description}</p>
                    </div>
                    <div className="relative z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`Actions for ${w.name}`}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => { const copy = { ...structuredClone(w), id: uid("wf"), name: `${w.name} copy`, lastRun: undefined, updatedAt: new Date().toISOString() }; saveWorkflow(copy); toast.success(`Duplicated as “${copy.name}”`); }}><Copy />Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem destructive onSelect={() => setToDelete(w)}><Trash2 />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[12px] text-muted-foreground">
                    <span>{w.nodes.length} nodes · edited {timeAgo(w.updatedAt)}</span>
                    {w.lastRun ? <StatusBadge status={w.lastRun.status} /> : <span className="rounded-full border px-2 py-0.5 text-[11px]">Never run</span>}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={creating} onOpenChange={(o) => !o && closeCreate()}>
        <DialogContent>
          <DialogHeader><DialogTitle>New workflow</DialogTitle><DialogDescription>Name it and choose a starting point.</DialogDescription></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); create(); }} className="space-y-5" noValidate>
            <FormField id="wf-name" label="Workflow name" required error={err ?? undefined}><Input autoFocus value={newName} onChange={(e) => { setNewName(e.target.value); setErr(null); }} placeholder="e.g. Refund approvals" /></FormField>
            <fieldset>
              <legend className="mb-2 text-[13px] font-medium">Start from</legend>
              <div className="grid gap-2">
                {[{ id: "blank", name: "Blank canvas", description: "Start from an empty graph" }, ...initialWorkflows].map((t) => (
                  <label key={t.id} className={cn("flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", template === t.id ? "border-primary bg-primary/5" : "hover:bg-accent")}>
                    <input type="radio" name="tpl" value={t.id} checked={template === t.id} onChange={() => setTemplate(t.id)} className="mt-1 accent-[hsl(var(--primary))]" />
                    <span><span className="block text-[13px] font-medium">{t.name}</span><span className="text-[12px] text-muted-foreground">{t.description}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>
            <DialogFooter className="mt-0"><Button type="button" variant="outline" onClick={closeCreate}>Cancel</Button><Button type="submit" variant="brand">Create & open builder</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete “{toDelete?.name}”?</DialogTitle><DialogDescription>The workflow and its run history will be removed from this browser.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { const w = toDelete!; deleteWorkflow(w.id); setToDelete(null); toast(`“${w.name}” deleted`, { action: { label: "Undo", onClick: () => saveWorkflow(w) } }); }}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
