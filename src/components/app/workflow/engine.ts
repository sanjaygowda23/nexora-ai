import type { FlowEdge, FlowNode } from "./templates";

export type ValidationResult = { ok: true } | { ok: false; error: string; nodeId?: string };

/** Static checks before a run: one+ trigger, no orphans, no cycles, conditions have both branches. */
export function validateWorkflow(nodes: FlowNode[], edges: FlowEdge[]): ValidationResult {
  if (nodes.length === 0) return { ok: false, error: "The canvas is empty. Add a trigger to start." };
  const triggers = nodes.filter((n) => n.data.kind === "trigger");
  if (triggers.length === 0) return { ok: false, error: "Add a trigger node — every workflow needs a starting event." };

  const out = adjacency(edges);
  const reached = new Set<string>();
  const stack = triggers.map((t) => t.id);
  while (stack.length) {
    const id = stack.pop()!;
    if (reached.has(id)) continue;
    reached.add(id);
    (out.get(id) ?? []).forEach((e) => stack.push(e.target));
  }
  const orphan = nodes.find((n) => !reached.has(n.id));
  if (orphan) return { ok: false, error: `“${orphan.data.label}” isn't connected to a trigger.`, nodeId: orphan.id };

  // cycle detection (DFS colouring)
  const color = new Map<string, 0 | 1 | 2>();
  const dfs = (id: string): boolean => {
    color.set(id, 1);
    for (const e of out.get(id) ?? []) {
      const c = color.get(e.target) ?? 0;
      if (c === 1) return true;
      if (c === 0 && dfs(e.target)) return true;
    }
    color.set(id, 2);
    return false;
  };
  for (const t of triggers) if (dfs(t.id)) return { ok: false, error: "This workflow contains a loop. Remove the cycle to run it." };

  const looseCondition = nodes.find((n) => n.data.kind === "condition" && (out.get(n.id) ?? []).length === 0);
  if (looseCondition) return { ok: false, error: `Condition “${looseCondition.data.label}” has no outgoing branch.`, nodeId: looseCondition.id };
  return { ok: true };
}

export function adjacency(edges: FlowEdge[]) {
  const m = new Map<string, FlowEdge[]>();
  edges.forEach((e) => m.set(e.source, [...(m.get(e.source) ?? []), e]));
  return m;
}

/** Evaluate a condition node against a simulated payload; returns the branch handle to follow. */
export function evaluateCondition(node: FlowNode, payload: Record<string, number | string>): "true" | "false" {
  const { field, operator, value } = node.data.config as { field?: string; operator?: string; value?: string | number };
  const actual = payload[String(field)];
  if (actual === undefined) return "true";
  const a = Number(actual), b = Number(value);
  switch (operator) {
    case ">=": return a >= b ? "true" : "false";
    case ">": return a > b ? "true" : "false";
    case "<=": return a <= b ? "true" : "false";
    case "<": return a < b ? "true" : "false";
    case "==": return String(actual) === String(value) ? "true" : "false";
    default: return "true";
  }
}

export type StepEvent = { nodeId: string; label: string; status: "running" | "success" | "failed" | "skipped"; at: number; detail?: string };
