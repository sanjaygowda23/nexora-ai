import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, Bot, CornerDownLeft, Plus, Search, Workflow } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { APP_NAV } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/AppStore";

type Item = { id: string; group: string; label: string; hint?: string; icon: typeof Bot; run: () => void };

/** ⌘K command palette: fuzzy-ish search across pages, agents, workflows and actions. Fully keyboard driven. */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { agents, workflows } = useAppStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const go = (to: string) => () => { navigate(to); onOpenChange(false); };

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...APP_NAV.map((n) => ({ id: n.to, group: "Pages", label: n.label, icon: n.icon, run: go(n.to) })),
      { id: "new-agent", group: "Actions", label: "Create a new agent", icon: Plus, run: go("/app/agents?new=1") },
      { id: "new-wf", group: "Actions", label: "Create a new workflow", icon: Plus, run: go("/app/workflows?new=1") },
      ...agents.map((a) => ({ id: a.id, group: "Agents", label: a.name, hint: a.role, icon: Bot, run: go(`/app/agents/${a.id}`) })),
      ...workflows.map((w) => ({ id: w.id, group: "Workflows", label: w.name, hint: `${w.nodes.length} nodes`, icon: Workflow, run: go(`/app/workflows/${w.id}`) })),
    ];
    const s = q.trim().toLowerCase();
    return s ? all.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(s)) : all.slice(0, 12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, agents, workflows]);

  useEffect(() => setIdx(0), [q]);
  useEffect(() => { if (!open) setQ(""); }, [open]);
  useEffect(() => { listRef.current?.querySelector(`[data-idx="${idx}"]`)?.scrollIntoView({ block: "nearest" }); }, [idx]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, items.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); items[idx]?.run(); }
  };

  let lastGroup = "";
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-[12vh] z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95" onKeyDown={onKey}>
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Search pages, agents and workflows</DialogPrimitive.Description>
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages, agents, workflows…"
              role="combobox" aria-expanded aria-controls="cmd-list" aria-activedescendant={items[idx] ? `cmd-${items[idx].id}` : undefined}
              className="h-12 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground" />
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">ESC</kbd>
          </div>
          <ul id="cmd-list" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
            {items.length === 0 && <li className="px-3 py-10 text-center text-[13px] text-muted-foreground">No results for “{q}”</li>}
            {items.map((it, i) => {
              const header = it.group !== lastGroup ? (lastGroup = it.group) : null;
              return (
                <li key={it.id + i}>
                  {header && <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{header}</p>}
                  <button id={`cmd-${it.id}`} role="option" aria-selected={i === idx} data-idx={i} onMouseMove={() => setIdx(i)} onClick={it.run}
                    className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px]", i === idx && "bg-accent")}>
                    <it.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{it.label}</span>
                    {it.hint && <span className="truncate text-muted-foreground">{it.hint}</span>}
                    {i === idx ? <CornerDownLeft className="ml-auto h-3.5 w-3.5 text-muted-foreground" /> : <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
