import { Brain, CircleCheck, GitBranch, Zap, type LucideIcon } from "lucide-react";
import type { NodeKind } from "./templates";

/** Visual identity per node kind. Colours from the validated categorical palette. */
export const KIND_META: Record<NodeKind, { label: string; icon: LucideIcon; color: string; description: string }> = {
  trigger: { label: "Trigger", icon: Zap, color: "#A77535", description: "Starts the workflow" },
  ai: { label: "AI step", icon: Brain, color: "#44705B", description: "Model or agent processing" },
  condition: { label: "Condition", icon: GitBranch, color: "#617F98", description: "Branch on a rule" },
  action: { label: "Action", icon: CircleCheck, color: "#987164", description: "Do something in a system" },
};
