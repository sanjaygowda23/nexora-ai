import type { Edge, Node } from "@xyflow/react";

export type NodeKind = "trigger" | "ai" | "condition" | "action";
export type RunState = "idle" | "queued" | "running" | "success" | "failed" | "skipped";

export interface FlowNodeData extends Record<string, unknown> {
  kind: NodeKind;
  label: string;
  /** Sub-type shown on the node, e.g. "Webhook", "Classify", "Send email". */
  variant: string;
  config: Record<string, string | number | boolean>;
  run?: RunState;
}

export type FlowNode = Node<FlowNodeData, "nexora">;
export type FlowEdge = Edge;

export interface SavedWorkflow {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  updatedAt: string;
  lastRun?: { status: "success" | "failed"; at: string; durationMs: number };
}

/** Palette definition: everything the builder needs to create a node of each kind. */
export const PALETTE: { kind: NodeKind; variant: string; label: string; description: string; config: FlowNodeData["config"] }[] = [
  { kind: "trigger", variant: "Webhook", label: "Incoming webhook", description: "Start when an HTTP event arrives", config: { path: "/hooks/inbound", method: "POST" } },
  { kind: "trigger", variant: "Schedule", label: "On a schedule", description: "Run at fixed intervals", config: { cron: "0 9 * * 1-5", timezone: "Asia/Kolkata" } },
  { kind: "trigger", variant: "New ticket", label: "New support ticket", description: "Fires on ticket creation", config: { queue: "General", priority: "any" } },
  { kind: "ai", variant: "Classify", label: "Classify intent", description: "Label input into categories", config: { model: "nexora-swift-s", labels: "billing, technical, account", minConfidence: 0.8 } },
  { kind: "ai", variant: "Extract", label: "Extract fields", description: "Pull structured data from text or docs", config: { model: "nexora-vision-m", schema: "invoice_v2" } },
  { kind: "ai", variant: "Agent", label: "Run agent", description: "Delegate to a registered agent", config: { agent: "Atlas", maxSteps: 8, approval: false } },
  { kind: "ai", variant: "Summarise", label: "Summarise", description: "Condense long content", config: { model: "nexora-reason-l", length: "short" } },
  { kind: "condition", variant: "If / else", label: "Confidence check", description: "Branch on a condition", config: { field: "confidence", operator: ">=", value: 0.8 } },
  { kind: "condition", variant: "Switch", label: "Route by category", description: "Multi-way branch", config: { field: "category", cases: "billing, technical" } },
  { kind: "action", variant: "Send email", label: "Send email", description: "Reply or notify by email", config: { to: "{{customer.email}}", template: "resolution" } },
  { kind: "action", variant: "Slack", label: "Post to Slack", description: "Notify a channel", config: { channel: "#ops-alerts", mention: "@oncall" } },
  { kind: "action", variant: "Update CRM", label: "Update CRM record", description: "Write fields back to CRM", config: { object: "Ticket", fields: "status, summary" } },
  { kind: "action", variant: "Human review", label: "Request approval", description: "Pause for a human decision", config: { assignee: "Support leads", slaHours: 4 } },
];

const n = (id: string, x: number, y: number, p: (typeof PALETTE)[number], label?: string): FlowNode => ({
  id, type: "nexora", position: { x, y },
  data: { kind: p.kind, variant: p.variant, label: label ?? p.label, config: { ...p.config } },
});
const P = (variant: string) => PALETTE.find((p) => p.variant === variant)!;
const e = (source: string, target: string, sourceHandle?: string): FlowEdge => ({
  id: `e_${source}_${target}${sourceHandle ? "_" + sourceHandle : ""}`, source, target, sourceHandle, animated: false,
});

export const initialWorkflows: SavedWorkflow[] = [
  {
    id: "wf_support",
    name: "Support triage",
    description: "Classify new tickets, auto-resolve confident ones, escalate the rest.",
    updatedAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    lastRun: { status: "success", at: new Date(Date.now() - 40 * 60_000).toISOString(), durationMs: 4200 },
    nodes: [
      n("t1", 0, 120, P("New ticket")),
      n("a1", 270, 120, P("Classify")),
      n("c1", 540, 120, P("If / else")),
      n("a2", 810, 20, P("Agent"), "Atlas resolves"),
      n("x1", 1080, 20, P("Send email"), "Send resolution"),
      n("x2", 810, 230, P("Human review"), "Escalate to specialist"),
      n("x3", 1080, 230, P("Slack"), "Notify #support-escalations"),
    ],
    edges: [e("t1", "a1"), e("a1", "c1"), e("c1", "a2", "true"), e("c1", "x2", "false"), e("a2", "x1"), e("x2", "x3")],
  },
  {
    id: "wf_invoice",
    name: "Accounts payable",
    description: "Extract invoice data, match to POs and route exceptions for approval.",
    updatedAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    lastRun: { status: "failed", at: new Date(Date.now() - 5 * 3600_000).toISOString(), durationMs: 7800 },
    nodes: [
      n("t1", 0, 100, P("Webhook"), "Invoice received"),
      n("a1", 270, 100, P("Extract"), "Extract line items"),
      n("c1", 540, 100, P("If / else"), "Matches PO?"),
      n("x1", 810, 0, P("Update CRM"), "Post to ERP"),
      n("x2", 810, 210, P("Human review"), "AP approval"),
    ],
    edges: [e("t1", "a1"), e("a1", "c1"), e("c1", "x1", "true"), e("c1", "x2", "false")],
  },
];
