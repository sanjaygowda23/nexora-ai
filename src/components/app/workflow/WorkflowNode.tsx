import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Check, Loader2, X } from "lucide-react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { KIND_META } from "./meta";
import type { FlowNode } from "./templates";

/** Custom React Flow node. Memoised: React Flow re-renders nodes often during drag. */
function WorkflowNodeImpl({ data, selected }: NodeProps<FlowNode>) {
  const meta = KIND_META[data.kind];
  const Icon = meta.icon;
  const run = data.run ?? "idle";
  const summary = Object.entries(data.config).slice(0, 2);

  return (
    <div
      className={cn(
        "relative w-[220px] rounded-xl border bg-card text-card-foreground shadow-sm transition-[box-shadow,border-color,opacity] duration-300",
        selected && "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]",
        run === "running" && "border-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.25),0_0_24px_hsl(var(--primary)/0.35)]",
        run === "success" && "border-success/60",
        run === "failed" && "border-destructive shadow-[0_0_0_3px_hsl(var(--destructive)/0.2)]",
        run === "skipped" && "opacity-40",
        run === "queued" && "opacity-80"
      )}
      aria-label={`${meta.label}: ${data.label}${run !== "idle" ? `, ${run}` : ""}`}
    >
      {data.kind !== "trigger" && <Handle type="target" position={Position.Left} />}

      <div className="flex items-center gap-2.5 border-b px-3 py-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md" style={{ background: `${meta.color}22`, color: meta.color }}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold leading-tight">{data.label}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{meta.label} · {data.variant}</p>
        </div>
        <RunIndicator run={run} />
      </div>
      <dl className="space-y-1 px-3 py-2.5 font-mono text-[10.5px]">
        {summary.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="truncate text-foreground/80">{String(v)}</dd>
          </div>
        ))}
      </dl>

      {data.kind === "condition" ? (
        <>
          <Handle id="true" type="source" position={Position.Right} style={{ top: "38%", background: "#22B07D" }} />
          <Handle id="false" type="source" position={Position.Right} style={{ top: "72%", background: "#E5484D" }} />
          <span className="pointer-events-none absolute -right-9 top-[38%] -translate-y-1/2 font-mono text-[9.5px] text-success">yes</span>
          <span className="pointer-events-none absolute -right-8 top-[72%] -translate-y-1/2 font-mono text-[9.5px] text-destructive">no</span>
        </>
      ) : (
        <Handle type="source" position={Position.Right} />
      )}
    </div>
  );
}

function RunIndicator({ run }: { run: string }) {
  if (run === "running") return <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />;
  if (run === "success") return <span className="grid h-4 w-4 place-items-center rounded-full bg-success text-white"><Check className="h-3 w-3" /></span>;
  if (run === "failed") return <span className="grid h-4 w-4 place-items-center rounded-full bg-destructive text-white"><X className="h-3 w-3" /></span>;
  if (run === "queued") return <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />;
  return null;
}

export const WorkflowNode = memo(WorkflowNodeImpl);
