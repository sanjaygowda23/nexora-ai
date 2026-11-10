import "@xyflow/react/dist/style.css";
import {
  addEdge, Background, BackgroundVariant, Controls, MiniMap, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow,
  type Connection, type NodeTypes, type OnSelectionChangeParams,
} from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, ChevronDown, Circle, Loader2, PanelLeft, PanelRight, Play, RotateCcw, Save, SkipForward, Square, Trash2, X, XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { KIND_META } from "@/components/app/workflow/meta";
import { adjacency, evaluateCondition, validateWorkflow, type StepEvent } from "@/components/app/workflow/engine";
import { PALETTE, type FlowEdge, type FlowNode, type FlowNodeData, type NodeKind, type RunState } from "@/components/app/workflow/templates";
import { WorkflowNode } from "@/components/app/workflow/WorkflowNode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/ui/states";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn, uid } from "@/lib/utils";
import { useAppStore } from "@/store/AppStore";

const nodeTypes: NodeTypes = { alder: WorkflowNode };
const DND_MIME = "application/alder-node";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function WorkflowBuilderPage() {
  const { id } = useParams();
  const { workflows } = useAppStore();
  const wf = workflows.find((w) => w.id === id);
  const navigate = useNavigate();
  if (!wf) return <div className="p-6"><EmptyState title="Workflow not found" description="It may have been deleted." action={{ label: "Back to workflows", onClick: () => navigate("/app/workflows") }} /></div>;
  return <ReactFlowProvider><Builder key={wf.id} wfId={wf.id} /></ReactFlowProvider>;
}

function Builder({ wfId }: { wfId: string }) {
  const { workflows, saveWorkflow, pushLog, settings } = useAppStore();
  const wf = workflows.find((w) => w.id === wfId)!;
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { screenToFlowPosition, fitView, getViewport } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(wf.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(wf.edges);
  const [name, setName] = useState(wf.name);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<StepEvent[]>([]);
  const [logOpen, setLogOpen] = useState(false);
  const [injectFailure, setInjectFailure] = useState(false);
  const [confidence, setConfidence] = useState(0.92);
  const [showPalette, setShowPalette] = useState(true);
  const [showProps, setShowProps] = useState(false);
  const cancelRef = useRef(false);
  const startRef = useRef(0);

  useEffect(() => { if (!isDesktop) { setShowPalette(false); setShowProps(false); } }, [isDesktop]);

  // Unsaved-changes guard (in-app navigation + tab close)
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const markDirty = useCallback(() => setDirty(true), []);
  const selected = nodes.find((n) => n.id === selectedId) ?? null;

  /* ------------------------------ editing ------------------------------ */
  const onConnect = useCallback((c: Connection) => {
    if (c.source === c.target) return;
    setEdges((eds) => addEdge({ ...c, id: uid("e") }, eds.filter((e) => !(e.source === c.source && e.sourceHandle === c.sourceHandle && c.sourceHandle))));
    markDirty();
  }, [setEdges, markDirty]);

  const addNode = useCallback((p: (typeof PALETTE)[number], position?: { x: number; y: number }) => {
    const pos = position ?? (() => { const v = getViewport(); return { x: (-v.x + 320) / v.zoom, y: (-v.y + 160) / v.zoom }; })();
    const node: FlowNode = { id: uid("n"), type: "alder", position: pos, data: { kind: p.kind, variant: p.variant, label: p.label, config: { ...p.config } } };
    setNodes((ns) => [...ns.map((n) => ({ ...n, selected: false })), { ...node, selected: true }]);
    setSelectedId(node.id);
    if (!isDesktop) setShowPalette(false);
    markDirty();
  }, [setNodes, getViewport, markDirty, isDesktop]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const variant = e.dataTransfer.getData(DND_MIME);
    const p = PALETTE.find((x) => x.variant === variant);
    if (!p) return;
    addNode(p, screenToFlowPosition({ x: e.clientX - 110, y: e.clientY - 30 }));
  }, [addNode, screenToFlowPosition]);

  const updateSelected = (patch: Partial<FlowNodeData>) => {
    if (!selected) return;
    setNodes((ns) => ns.map((n) => (n.id === selected.id ? { ...n, data: { ...n.data, ...patch } } : n)));
    markDirty();
  };
  const deleteSelected = () => {
    if (!selected) return;
    setNodes((ns) => ns.filter((n) => n.id !== selected.id));
    setEdges((es) => es.filter((e) => e.source !== selected.id && e.target !== selected.id));
    setSelectedId(null);
    markDirty();
  };

  const onSelectionChange = useCallback(({ nodes: sel }: OnSelectionChangeParams) => {
    setSelectedId(sel[0]?.id ?? null);
    if (sel[0]) setShowProps(true);
  }, []);

  /* -------------------------------- save -------------------------------- */
  const save = useCallback((silent = false) => {
    const clean = nodes.map(({ id, type, position, data }) => ({ id, type, position, data: { ...data, run: undefined } })) as FlowNode[];
    saveWorkflow({ ...wf, name: name.trim() || "Untitled workflow", nodes: clean, edges: edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({ id, source, target, sourceHandle, targetHandle })), updatedAt: new Date().toISOString() });
    setDirty(false);
    if (!silent) toast.success("Workflow saved", { description: "Stored in this browser — it'll be here when you come back." });
  }, [nodes, edges, name, wf, saveWorkflow]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [save]);

  /* ------------------------------ execution ----------------------------- */
  const setRun = (ids: string[] | "all", run: RunState) =>
    setNodes((ns) => ns.map((n) => (ids === "all" || ids.includes(n.id) ? { ...n, data: { ...n.data, run } } : n)));
  const setEdgeActive = (ids: string[], active: boolean) =>
    setEdges((es) => es.map((e) => (ids.includes(e.id) ? { ...e, animated: active, style: active ? { stroke: "#44705B", strokeWidth: 2 } : e.style } : e)));

  const resetRun = () => {
    setNodes((ns) => ns.map((n) => ({ ...n, data: { ...n.data, run: undefined } })));
    setEdges((es) => es.map((e) => ({ ...e, animated: false, style: undefined })));
    setEvents([]);
  };

  const execute = async () => {
    const v = validateWorkflow(nodes, edges);
    if (!v.ok) {
      toast.error("Can't run this workflow", { description: v.error });
      if (v.nodeId) { setSelectedId(v.nodeId); setNodes((ns) => ns.map((n) => ({ ...n, selected: n.id === v.nodeId }))); fitView({ nodes: [{ id: v.nodeId }], duration: 500, maxZoom: 1.2 }); }
      return;
    }
    resetRun();
    setRunning(true);
    setLogOpen(true);
    cancelRef.current = false;
    startRef.current = performance.now();
    const payload = { confidence, category: "billing" };
    const out = adjacency(edges);
    const byId = new Map(nodes.map((n) => [n.id, n]));
    setRun("all", "queued");
    const log = (e: Omit<StepEvent, "at">) => setEvents((prev) => [...prev, { ...e, at: Math.round(performance.now() - startRef.current) }]);

    // Pick the action node most likely to be "the risky one" for injected failure
    const failTarget = injectFailure ? nodes.find((n) => n.data.kind === "action")?.id : undefined;
    const visited = new Set<string>();
    let failed = false;
    let frontier = nodes.filter((n) => n.data.kind === "trigger").map((n) => n.id);

    while (frontier.length && !cancelRef.current && !failed) {
      const next: string[] = [];
      setRun(frontier, "running");
      frontier.forEach((id) => log({ nodeId: id, label: byId.get(id)!.data.label, status: "running" }));
      await sleep(settings.appearance.reduceMotion ? 250 : 850);
      if (cancelRef.current) break;

      for (const id of frontier) {
        visited.add(id);
        const n = byId.get(id)!;
        if (id === failTarget) {
          setRun([id], "failed");
          log({ nodeId: id, label: n.data.label, status: "failed", detail: "Connector returned 503 · retries exhausted (3/3)" });
          failed = true;
          break;
        }
        setRun([id], "success");
        let outs = out.get(id) ?? [];
        let detail: string | undefined;
        if (n.data.kind === "condition") {
          const branch = n.data.variant === "If / else" ? evaluateCondition(n, payload) : "true";
          const taken = outs.filter((e) => (e.sourceHandle ?? "true") === branch);
          const skipped = outs.filter((e) => !taken.includes(e));
          skipped.forEach((e) => markSkipped(e.target));
          outs = taken;
          detail = `→ ${branch === "true" ? "yes" : "no"} branch (${n.data.config.field} = ${payload[n.data.config.field as keyof typeof payload] ?? "n/a"})`;
        } else if (n.data.kind === "ai") {
          detail = `${n.data.config.model ?? "agent"} · ${Math.round(600 + Math.random() * 1800)} tokens`;
        }
        log({ nodeId: id, label: n.data.label, status: "success", detail });
        setEdgeActive(outs.map((e) => e.id), true);
        outs.forEach((e) => { if (!visited.has(e.target) && !next.includes(e.target)) next.push(e.target); });
      }
      frontier = next;
    }

    /** Untaken branch: grey out its subtree (a node reached later by a live path will override this). */
    function markSkipped(start: string) {
      const stack = [start];
      const seen = new Set<string>();
      while (stack.length) {
        const id = stack.pop()!;
        if (seen.has(id) || visited.has(id)) continue;
        seen.add(id);
        setRun([id], "skipped");
        log({ nodeId: id, label: byId.get(id)!.data.label, status: "skipped" });
        (out.get(id) ?? []).forEach((e) => stack.push(e.target));
      }
    }

    const duration = Math.round(performance.now() - startRef.current);
    setRunning(false);
    setEdges((es) => es.map((e) => ({ ...e, animated: false })));
    if (cancelRef.current) {
      setNodes((ns) => ns.map((n) => (n.data.run === "running" || n.data.run === "queued" ? { ...n, data: { ...n.data, run: "skipped" } } : n)));
      toast("Run cancelled");
      return;
    }
    setNodes((ns) => ns.map((n) => (n.data.run === "queued" ? { ...n, data: { ...n.data, run: "skipped" } } : n)));
    const status = failed ? "failed" : "success";
    saveWorkflow({ ...wf, name, nodes: wf.nodes, edges: wf.edges, lastRun: { status, at: new Date().toISOString(), durationMs: duration } });
    pushLog({ agent: "Orchestrator", workflow: name, action: failed ? `Workflow run failed at an action step` : `Workflow run completed (${visited.size} steps)`, status, durationMs: duration, tokens: visited.size * 840 });
    failed
      ? toast.error("Run failed", { description: "An action step failed. See the execution log for details." })
      : toast.success("Run completed", { description: `${visited.size} steps in ${(duration / 1000).toFixed(1)}s` });
  };

  /* --------------------------------- UI --------------------------------- */
  const grouped = useMemo(() => (["trigger", "ai", "condition", "action"] as NodeKind[]).map((k) => ({ kind: k, items: PALETTE.filter((p) => p.kind === k) })), []);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b bg-surface px-3 py-2 md:px-4">
        <Tooltip content="All workflows"><Button asChild variant="ghost" size="icon-sm"><Link to="/app/workflows" aria-label="Back to workflows"><ArrowLeft className="h-4 w-4" /></Link></Button></Tooltip>
        <Input value={name} onChange={(e) => { setName(e.target.value); markDirty(); }} aria-label="Workflow name" className="h-8 w-40 border-transparent bg-transparent font-semibold hover:border-input sm:w-56" />
        <span className={cn("hidden items-center gap-1.5 text-[12px] sm:flex", dirty ? "text-warning" : "text-muted-foreground")}>
          <Circle className={cn("h-2 w-2", dirty ? "fill-warning" : "fill-success text-success")} />{dirty ? "Unsaved changes" : "Saved"}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <Button variant="ghost" size="icon-sm" aria-label="Toggle components panel" aria-pressed={showPalette} onClick={() => setShowPalette((s) => !s)}><PanelLeft className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Toggle properties panel" aria-pressed={showProps} onClick={() => setShowProps((s) => !s)}><PanelRight className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={resetRun} disabled={running || events.length === 0}><RotateCcw className="h-3.5 w-3.5" /><span className="hidden sm:inline">Reset</span></Button>
          <Button variant="outline" size="sm" onClick={() => save()} disabled={running}><Save className="h-3.5 w-3.5" />Save</Button>
          {running ? (
            <Button variant="destructive" size="sm" onClick={() => (cancelRef.current = true)}><Square className="h-3.5 w-3.5" />Stop</Button>
          ) : (
            <Button variant="brand" size="sm" onClick={execute}><Play className="h-3.5 w-3.5" />Run</Button>
          )}
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1">
        {/* Palette */}
        <AnimatePresence initial={false}>
          {showPalette && (
            <motion.aside initial={{ x: -280, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -280, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="absolute inset-y-0 left-0 z-10 w-60 overflow-y-auto border-r bg-surface p-3 shadow-xl lg:static lg:shadow-none" aria-label="Components">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[12px] font-semibold">Components</p>
                <button className="rounded p-1 text-muted-foreground hover:bg-accent lg:hidden" onClick={() => setShowPalette(false)} aria-label="Close components"><X className="h-4 w-4" /></button>
              </div>
              <p className="mb-3 px-1 text-[11.5px] text-muted-foreground">Drag onto the canvas, or click to add.</p>
              {grouped.map((g) => {
                const M = KIND_META[g.kind];
                return (
                  <div key={g.kind} className="mb-4">
                    <p className="mb-1.5 flex items-center gap-1.5 px-1 font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: M.color }}><M.icon className="h-3 w-3" />{M.label}s</p>
                    <ul className="space-y-1">
                      {g.items.map((p) => (
                        <li key={p.variant}>
                          <button draggable onDragStart={(e) => { e.dataTransfer.setData(DND_MIME, p.variant); e.dataTransfer.effectAllowed = "move"; }}
                            onClick={() => addNode(p)}
                            className="group flex w-full cursor-grab items-start gap-2.5 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-border hover:bg-accent active:cursor-grabbing">
                            <span className="mt-0.5 h-6 w-1 shrink-0 rounded-full" style={{ background: M.color }} aria-hidden />
                            <span className="min-w-0"><span className="block text-[12.5px] font-medium">{p.variant}</span><span className="block text-[11px] leading-snug text-muted-foreground">{p.description}</span></span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Canvas */}
        <div className="relative min-w-0 flex-1" onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes} edges={edges} nodeTypes={nodeTypes}
            onNodesChange={(c) => { onNodesChange(c); if (c.some((x) => x.type === "position" && x.dragging === false || x.type === "remove")) markDirty(); }}
            onEdgesChange={(c) => { onEdgesChange(c); if (c.some((x) => x.type === "remove")) markDirty(); }}
            onConnect={onConnect} onSelectionChange={onSelectionChange}
            fitView fitViewOptions={{ padding: 0.2, maxZoom: 1 }} minZoom={0.25} maxZoom={1.75}
            deleteKeyCode={["Backspace", "Delete"]} nodesDraggable={!running} nodesConnectable={!running}
            defaultEdgeOptions={{ type: "smoothstep" }} proOptions={{ hideAttribution: true }}
            colorMode={document.documentElement.classList.contains("dark") ? "dark" : "light"}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="hsl(var(--muted-foreground) / 0.35)" />
            <Controls showInteractive={false} position="bottom-left" />
            {isDesktop && <MiniMap pannable zoomable position="bottom-right" style={{ width: 150, height: 96 }} nodeColor={(n) => KIND_META[(n.data as FlowNodeData).kind].color} maskColor="hsl(var(--background) / 0.7)" />}
          </ReactFlow>

          {nodes.length === 0 && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center p-6">
              <div className="rounded-xl border border-dashed bg-surface/80 p-6 text-center backdrop-blur">
                <p className="text-sm font-semibold">Start with a trigger</p>
                <p className="mt-1 text-[12.5px] text-muted-foreground">Drag a component from the left panel, or click one to add it.</p>
              </div>
            </div>
          )}

          {/* Simulation controls */}
          <div className="absolute left-3 top-3 z-[5] flex flex-wrap items-center gap-3 rounded-lg border bg-surface/90 px-3 py-2 text-[12px] shadow-sm backdrop-blur">
            <label className="flex items-center gap-2"><span className="text-muted-foreground">Test confidence</span>
              <input type="range" min={0.5} max={1} step={0.01} value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} className="w-20 accent-[hsl(var(--primary))]" aria-label="Simulated model confidence" />
              <span className="w-8 font-mono">{confidence.toFixed(2)}</span></label>
            <label className="flex items-center gap-2"><Switch checked={injectFailure} onCheckedChange={setInjectFailure} aria-label="Inject a failure" /><span className="text-muted-foreground">Inject failure</span></label>
          </div>

          {/* Execution log */}
          <AnimatePresence>
            {(logOpen && events.length > 0) && (
              <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                className="absolute bottom-3 left-1/2 z-[5] w-[min(560px,calc(100%-1.5rem))] -translate-x-1/2 overflow-hidden rounded-xl border bg-surface/95 shadow-2xl backdrop-blur" aria-label="Execution log">
                <header className="flex items-center justify-between border-b px-3 py-2">
                  <p className="flex items-center gap-2 text-[12.5px] font-semibold">
                    {running ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> : events.some((e) => e.status === "failed") ? <XCircle className="h-3.5 w-3.5 text-destructive" /> : <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                    Execution {running ? "in progress" : events.some((e) => e.status === "failed") ? "failed" : "succeeded"}
                  </p>
                  <button onClick={() => setLogOpen(false)} className="rounded p-1 text-muted-foreground hover:bg-accent" aria-label="Hide execution log"><ChevronDown className="h-4 w-4" /></button>
                </header>
                <ol className="max-h-44 overflow-y-auto p-2 font-mono text-[11.5px]" aria-live="polite">
                  {events.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 rounded px-1.5 py-1 hover:bg-accent">
                      <span className="w-14 shrink-0 text-right text-muted-foreground">{e.at}ms</span>
                      {e.status === "running" ? <Loader2 className="mt-0.5 h-3 w-3 shrink-0 animate-spin text-primary" /> : e.status === "success" ? <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" /> : e.status === "failed" ? <XCircle className="mt-0.5 h-3 w-3 shrink-0 text-destructive" /> : <SkipForward className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />}
                      <span className="min-w-0"><span className={cn(e.status === "skipped" && "text-muted-foreground line-through")}>{e.label}</span>{e.detail && <span className="block text-muted-foreground">{e.detail}</span>}</span>
                    </li>
                  ))}
                </ol>
              </motion.section>
            )}
          </AnimatePresence>
          {!logOpen && events.length > 0 && (
            <button onClick={() => setLogOpen(true)} className="absolute bottom-3 left-1/2 z-[5] -translate-x-1/2 rounded-full border bg-surface px-3 py-1.5 text-[12px] shadow">Show execution log</button>
          )}
        </div>

        {/* Properties */}
        <AnimatePresence initial={false}>
          {showProps && (
            <motion.aside initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="absolute inset-y-0 right-0 z-10 w-72 overflow-y-auto border-l bg-surface p-4 shadow-xl lg:static lg:shadow-none" aria-label="Node properties">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[12px] font-semibold">Properties</p>
                <button className="rounded p-1 text-muted-foreground hover:bg-accent lg:hidden" onClick={() => setShowProps(false)} aria-label="Close properties"><X className="h-4 w-4" /></button>
              </div>
              {selected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 rounded-lg border p-2.5" style={{ borderColor: `${KIND_META[selected.data.kind].color}55` }}>
                    {(() => { const M = KIND_META[selected.data.kind]; return <span className="grid h-7 w-7 place-items-center rounded-md" style={{ background: `${M.color}22`, color: M.color }}><M.icon className="h-4 w-4" /></span>; })()}
                    <div><p className="text-[12.5px] font-medium">{KIND_META[selected.data.kind].label}</p><p className="font-mono text-[10.5px] text-muted-foreground">{selected.data.variant} · {selected.id}</p></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="np-label">Label</Label>
                    <Input id="np-label" value={selected.data.label} onChange={(e) => updateSelected({ label: e.target.value })} className="h-9" /></div>
                  {Object.entries(selected.data.config).map(([k, v]) => (
                    <div key={k} className="space-y-2">
                      <Label htmlFor={`np-${k}`} className="font-mono text-[11.5px] font-normal">{k}</Label>
                      {typeof v === "boolean" ? (
                        <Switch id={`np-${k}`} checked={v} onCheckedChange={(c) => updateSelected({ config: { ...selected.data.config, [k]: c } })} />
                      ) : k === "operator" ? (
                        <select id={`np-${k}`} value={String(v)} onChange={(e) => updateSelected({ config: { ...selected.data.config, [k]: e.target.value } })}
                          className="h-9 w-full rounded-lg border border-input bg-surface px-2 text-sm">
                          {[">=", ">", "<=", "<", "=="].map((o) => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <Input id={`np-${k}`} type={typeof v === "number" ? "number" : "text"} step="any" value={String(v)} className="h-9 font-mono text-[12.5px]"
                          onChange={(e) => updateSelected({ config: { ...selected.data.config, [k]: typeof v === "number" ? Number(e.target.value) : e.target.value } })} />
                      )}
                    </div>
                  ))}
                  {selected.data.kind === "condition" && <p className="rounded-lg bg-muted p-2.5 text-[11.5px] text-muted-foreground">The green handle is the “yes” branch, red is “no”. Adjust <em>Test confidence</em> on the canvas to see the branch change.</p>}
                  <Button variant="ghost" size="sm" className="w-full text-destructive hover:bg-destructive/10" onClick={deleteSelected}><Trash2 className="h-4 w-4" />Delete node</Button>
                </div>
              ) : (
                <div className="space-y-4 text-[12.5px] text-muted-foreground">
                  <p>Select a node to edit its properties.</p>
                  <div className="rounded-lg border p-3">
                    <p className="mb-2 font-medium text-foreground">Shortcuts</p>
                    <ul className="space-y-1.5">
                      <li className="flex justify-between"><span>Save</span><kbd className="font-mono">⌘/Ctrl S</kbd></li>
                      <li className="flex justify-between"><span>Delete selection</span><kbd className="font-mono">Del</kbd></li>
                      <li className="flex justify-between"><span>Connect</span><span>drag handle → handle</span></li>
                      <li className="flex justify-between"><span>Multi-select</span><kbd className="font-mono">Shift + drag</kbd></li>
                    </ul>
                  </div>
                  <dl className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border p-3"><dt>Nodes</dt><dd className="mt-1 text-lg font-semibold text-foreground">{nodes.length}</dd></div>
                    <div className="rounded-lg border p-3"><dt>Connections</dt><dd className="mt-1 text-lg font-semibold text-foreground">{edges.length}</dd></div>
                  </dl>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Leave-with-unsaved-changes dialog */}
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" role="alertdialog" aria-modal="true" aria-labelledby="leave-h">
          <div className="w-full max-w-md rounded-2xl border bg-popover p-6 shadow-2xl">
            <h2 id="leave-h" className="text-lg font-semibold">Save changes before leaving?</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">You have unsaved edits to “{name}”.</p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => blocker.reset()}>Stay</Button>
              <Button variant="outline" onClick={() => { setDirty(false); blocker.proceed(); }}>Discard</Button>
              <Button variant="brand" onClick={() => { save(true); blocker.proceed(); }}>Save & leave</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
