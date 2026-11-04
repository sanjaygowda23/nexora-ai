import { Brain, CircleCheck, GitBranch, Zap, type LucideIcon } from "lucide-react";
import type { NodeKind } from "./templates";

/** Visual identity per node kind. Colours from the validated categorical palette. */
export const KIND_META: Record<NodeKind, { label: string; icon: LucideIcon; color: string; description: string }> = {
  trigger: { label: "Trigger", icon: Zap, color: "#C4861E", description: "Starts the workflow" },
  ai: { label: "AI step", icon: Brain, color: "#4C7DFF", description: "Model or agent processing" },
  condition: { label: "Condition", icon: GitBranch, color: "#9A62F5", description: "Branch on a rule" },
  action: { label: "Action", icon: CircleCheck, color: "#16998A", description: "Do something in a system" },
};
