import { Badge } from "@/components/ui/badge";
import type { AgentStatus, LogStatus } from "@/data/appMock";

const MAP: Record<AgentStatus | LogStatus, { tone: "success" | "warning" | "danger" | "info" | "neutral" | "violet"; label: string }> = {
  active: { tone: "success", label: "Active" },
  paused: { tone: "neutral", label: "Paused" },
  error: { tone: "danger", label: "Error" },
  draft: { tone: "violet", label: "Draft" },
  success: { tone: "success", label: "Success" },
  failed: { tone: "danger", label: "Failed" },
  running: { tone: "info", label: "Running" },
  warning: { tone: "warning", label: "Warning" },
};

export function StatusBadge({ status }: { status: AgentStatus | LogStatus }) {
  const m = MAP[status];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}
