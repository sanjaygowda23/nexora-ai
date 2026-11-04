import { seeded } from "@/lib/utils";

export type AgentStatus = "active" | "paused" | "error" | "draft";
export type AgentModel = "nexora-reason-l" | "nexora-swift-s" | "nexora-vision-m";

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  model: AgentModel;
  department: string;
  temperature: number;
  approvalRequired: boolean;
  tools: string[];
  runs: number;
  successRate: number;
  avgLatencyMs: number;
  costUsd: number;
  owner: string;
  createdAt: string;
  lastRunAt: string;
}

export const AGENT_TOOLS = ["CRM read", "CRM write", "Ticketing", "Email", "Slack", "Knowledge base", "SQL warehouse", "Document OCR", "Calendar", "Payments (read)"] as const;
export const DEPARTMENTS = ["Support", "Finance", "Operations", "Marketing", "Sales", "Engineering"] as const;
export const MODELS: { id: AgentModel; label: string; hint: string }[] = [
  { id: "nexora-reason-l", label: "Reason L", hint: "Deep multi-step reasoning" },
  { id: "nexora-swift-s", label: "Swift S", hint: "Fast, low-cost classification" },
  { id: "nexora-vision-m", label: "Vision M", hint: "Documents and images" },
];

const now = Date.now();
const ago = (mins: number) => new Date(now - mins * 60_000).toISOString();

const seedAgents: Omit<Agent, "id">[] = [
  { name: "Atlas", role: "Tier-1 Support Resolver", description: "Resolves common support tickets using help-centre articles and account context; hands off with a summary when confidence is low.", status: "active", model: "nexora-reason-l", department: "Support", temperature: 0.2, approvalRequired: false, tools: ["Ticketing", "Knowledge base", "CRM read"], runs: 18420, successRate: 96.4, avgLatencyMs: 2310, costUsd: 1284, owner: "Aisha Kapoor", createdAt: ago(60 * 24 * 92), lastRunAt: ago(1) },
  { name: "Ledger", role: "Reconciliation Analyst", description: "Matches ledger entries across systems, explains breaks and proposes journal entries for approval.", status: "active", model: "nexora-reason-l", department: "Finance", temperature: 0.1, approvalRequired: true, tools: ["SQL warehouse", "Payments (read)", "Email"], runs: 6230, successRate: 98.1, avgLatencyMs: 4120, costUsd: 742, owner: "Daniel Cho", createdAt: ago(60 * 24 * 61), lastRunAt: ago(4) },
  { name: "Scout", role: "Lead Qualification", description: "Enriches inbound leads, scores fit and routes qualified accounts to the right rep.", status: "active", model: "nexora-swift-s", department: "Sales", temperature: 0.3, approvalRequired: false, tools: ["CRM read", "CRM write", "Slack"], runs: 11870, successRate: 93.2, avgLatencyMs: 880, costUsd: 211, owner: "Maya Fernandes", createdAt: ago(60 * 24 * 40), lastRunAt: ago(7) },
  { name: "Quill", role: "Product Copywriter", description: "Generates on-brand product descriptions and campaign variants for editor review.", status: "paused", model: "nexora-reason-l", department: "Marketing", temperature: 0.7, approvalRequired: true, tools: ["Knowledge base", "Document OCR"], runs: 3140, successRate: 91.0, avgLatencyMs: 3560, costUsd: 389, owner: "Rohan Mehta", createdAt: ago(60 * 24 * 33), lastRunAt: ago(60 * 26) },
  { name: "Sentinel", role: "Incident Triage", description: "Classifies alerts, correlates with recent deploys, and pages the right on-call engineer.", status: "error", model: "nexora-swift-s", department: "Engineering", temperature: 0.1, approvalRequired: false, tools: ["Slack", "Ticketing", "SQL warehouse"], runs: 8902, successRate: 87.5, avgLatencyMs: 640, costUsd: 133, owner: "Ivan Petrov", createdAt: ago(60 * 24 * 75), lastRunAt: ago(12) },
  { name: "Docket", role: "Invoice Processor", description: "Extracts line items from supplier invoices, validates against POs and flags exceptions.", status: "active", model: "nexora-vision-m", department: "Finance", temperature: 0.0, approvalRequired: true, tools: ["Document OCR", "SQL warehouse", "Email"], runs: 9710, successRate: 97.3, avgLatencyMs: 2980, costUsd: 655, owner: "Daniel Cho", createdAt: ago(60 * 24 * 58), lastRunAt: ago(3) },
  { name: "Relay", role: "Meeting Scheduler", description: "Coordinates multi-party meetings across calendars and time zones from email threads.", status: "active", model: "nexora-swift-s", department: "Operations", temperature: 0.2, approvalRequired: false, tools: ["Calendar", "Email"], runs: 4420, successRate: 95.8, avgLatencyMs: 1120, costUsd: 72, owner: "Aisha Kapoor", createdAt: ago(60 * 24 * 21), lastRunAt: ago(18) },
  { name: "Compass", role: "Churn Risk Analyst", description: "Combines usage, sentiment and billing signals into weekly account-risk briefs for CSMs.", status: "draft", model: "nexora-reason-l", department: "Support", temperature: 0.3, approvalRequired: false, tools: ["SQL warehouse", "CRM read"], runs: 0, successRate: 0, avgLatencyMs: 0, costUsd: 0, owner: "Maya Fernandes", createdAt: ago(60 * 24 * 2), lastRunAt: ago(60 * 24 * 2) },
  { name: "Harbor", role: "Contract Reviewer", description: "Reviews inbound vendor contracts against playbook clauses and highlights deviations.", status: "active", model: "nexora-reason-l", department: "Operations", temperature: 0.1, approvalRequired: true, tools: ["Document OCR", "Knowledge base", "Email"], runs: 1280, successRate: 94.6, avgLatencyMs: 6240, costUsd: 318, owner: "Rohan Mehta", createdAt: ago(60 * 24 * 14), lastRunAt: ago(45) },
  { name: "Pulse", role: "Social Listening", description: "Monitors mentions and summarises emerging themes for the brand team every morning.", status: "paused", model: "nexora-swift-s", department: "Marketing", temperature: 0.4, approvalRequired: false, tools: ["Slack", "Knowledge base"], runs: 2210, successRate: 92.4, avgLatencyMs: 970, costUsd: 48, owner: "Rohan Mehta", createdAt: ago(60 * 24 * 49), lastRunAt: ago(60 * 72) },
];

export const initialAgents: Agent[] = seedAgents.map((a, i) => ({ ...a, id: `agt_${(i + 1).toString().padStart(3, "0")}` }));

/* ----------------------------- Activity logs ----------------------------- */
export type LogStatus = "success" | "failed" | "running" | "warning";
export interface ActivityLog {
  id: string; timestamp: string; agent: string; workflow: string; action: string; status: LogStatus; durationMs: number; tokens: number;
}

const ACTIONS: Record<string, string[]> = {
  Atlas: ["Resolved ticket #{n}", "Handed off ticket #{n} to Billing", "Drafted reply for ticket #{n}"],
  Ledger: ["Reconciled batch {n}", "Flagged break in batch {n}", "Proposed journal entry JE-{n}"],
  Scout: ["Qualified lead L-{n}", "Enriched account A-{n}", "Routed lead L-{n} to EMEA"],
  Quill: ["Generated copy for SKU {n}", "Created 4 campaign variants"],
  Sentinel: ["Triaged alert ALR-{n}", "Paged on-call for ALR-{n}", "Tool timeout: monitoring API"],
  Docket: ["Processed invoice INV-{n}", "PO mismatch on INV-{n}", "Extracted 14 line items"],
  Relay: ["Scheduled meeting with 4 attendees", "Rescheduled sync #{n}"],
  Harbor: ["Reviewed contract C-{n}", "Flagged indemnity clause in C-{n}"],
};
const WORKFLOW_FOR: Record<string, string> = {
  Atlas: "Support triage", Ledger: "Month-end close", Scout: "Inbound lead routing", Quill: "Product content",
  Sentinel: "Incident response", Docket: "Accounts payable", Relay: "Executive scheduling", Harbor: "Vendor onboarding",
};

export function generateLogs(count = 240): ActivityLog[] {
  const rnd = seeded(42);
  const agents = Object.keys(ACTIONS);
  const out: ActivityLog[] = [];
  let t = now;
  for (let i = 0; i < count; i++) {
    t -= Math.floor(rnd() * 14 + 1) * 60_000;
    const agent = agents[Math.floor(rnd() * agents.length)];
    const tmpl = ACTIONS[agent][Math.floor(rnd() * ACTIONS[agent].length)];
    const r = rnd();
    let status: LogStatus = r < 0.82 ? "success" : r < 0.9 ? "warning" : r < 0.97 ? "failed" : "running";
    if (i < 2) status = "running";
    if (tmpl.includes("timeout") || tmpl.includes("mismatch")) status = tmpl.includes("timeout") ? "failed" : "warning";
    out.push({
      id: `log_${(count - i).toString().padStart(5, "0")}`,
      timestamp: new Date(t).toISOString(),
      agent,
      workflow: WORKFLOW_FOR[agent],
      action: tmpl.replace("{n}", String(Math.floor(rnd() * 90000 + 10000))),
      status,
      durationMs: Math.floor(rnd() * 6000 + 300),
      tokens: Math.floor(rnd() * 9000 + 400),
    });
  }
  return out;
}

/* ------------------------------- Analytics ------------------------------- */
export interface DailyPoint { date: string; tasks: number; success: number; failed: number; cost: number; latency: number; }

export function generateDaily(days = 90): DailyPoint[] {
  const rnd = seeded(7);
  const out: DailyPoint[] = [];
  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(now - d * 86_400_000);
    const weekday = date.getDay();
    const weekend = weekday === 0 || weekday === 6;
    const trend = 1 + (days - d) / days * 0.65;
    const tasks = Math.round((weekend ? 1700 : 3400) * trend * (0.9 + rnd() * 0.2));
    const failRate = 0.025 + rnd() * 0.025;
    const failed = Math.round(tasks * failRate);
    out.push({
      date: date.toISOString().slice(0, 10),
      tasks,
      success: tasks - failed,
      failed,
      cost: Math.round(tasks * (0.031 + rnd() * 0.006) * 100) / 100,
      latency: Math.round(1500 + rnd() * 900 - (days - d) * 4),
    });
  }
  return out;
}

export const systemHealth = [
  { name: "Orchestrator", status: "operational" as const, latency: 42, uptime: 99.99 },
  { name: "Model gateway", status: "operational" as const, latency: 318, uptime: 99.97 },
  { name: "Vector index", status: "operational" as const, latency: 27, uptime: 99.99 },
  { name: "Connector: Ticketing", status: "operational" as const, latency: 156, uptime: 99.95 },
  { name: "Connector: Monitoring API", status: "degraded" as const, latency: 2140, uptime: 98.71 },
];
