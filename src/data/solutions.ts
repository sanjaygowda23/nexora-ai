import { Bot, BrainCircuit, Cable, Cpu, ServerCog, Workflow, type LucideIcon } from "lucide-react";

export type Solution = {
  id: string; index: string; title: string; icon: LucideIcon; tagline: string;
  problem: string; solution: string; features: string[];
  flow: string[]; benefits: { value: string; label: string }[]; cta: string;
};

export const solutions: Solution[] = [
  {
    id: "consulting", index: "01", title: "AI Consulting", icon: BrainCircuit,
    tagline: "Find the work AI should do first — and prove it pays.",
    problem: "Most AI programmes stall between pilot and production. Teams chase demos, not outcomes, and leadership can't see which use cases will move margin.",
    solution: "We run a structured opportunity assessment across your operations, score each use case on value, feasibility and risk, and deliver a sequenced roadmap with a costed business case.",
    features: ["Process mining & opportunity scoring", "Data readiness audit", "Build vs. buy analysis", "Risk & compliance mapping", "Executive ROI model"],
    flow: ["Interviews", "Process map", "Scoring", "Roadmap"],
    benefits: [{ value: "2 wks", label: "to a prioritised roadmap" }, { value: "12–20", label: "use cases assessed" }, { value: "1", label: "board-ready business case" }],
    cta: "Book an assessment",
  },
  {
    id: "development", index: "02", title: "Custom AI Development", icon: Cpu,
    tagline: "Models and applications shaped around your data, not a generic API.",
    problem: "Off-the-shelf models don't know your products, policies or terminology, and their answers can't be traced back to an approved source.",
    solution: "We build retrieval-grounded applications, fine-tuned classifiers and domain copilots on top of your knowledge base, with evaluation suites that measure accuracy before anything ships.",
    features: ["Retrieval-augmented generation", "Fine-tuning & distillation", "Evaluation harnesses", "Human-in-the-loop review", "Model-agnostic architecture"],
    flow: ["Your data", "Embed & index", "Grounded model", "Evaluated output"],
    benefits: [{ value: "Cited", label: "answers traced to source" }, { value: "Model-agnostic", label: "swap providers freely" }, { value: "Eval-gated", label: "releases" }],
    cta: "Scope a build",
  },
  {
    id: "agents", index: "03", title: "AI Agents", icon: Bot,
    tagline: "Digital workers that plan, act and escalate — under supervision.",
    problem: "Repetitive knowledge work — triage, reconciliation, research, follow-ups — consumes skilled people and creates queues that customers feel.",
    solution: "We design task-specific agents with scoped tool access, approval checkpoints and full audit trails, so they can take real action in your systems while staying accountable.",
    features: ["Tool-using agents with scoped permissions", "Approval & escalation policies", "Multi-agent hand-offs", "Memory & context management", "Replayable execution traces"],
    flow: ["Request", "Plan", "Act via tools", "Review / escalate"],
    benefits: [{ value: "24/7", label: "coverage" }, { value: "Every action", label: "logged & replayable" }, { value: "Human", label: "approval where it matters" }],
    cta: "Design an agent",
  },
  {
    id: "automation", index: "04", title: "Intelligent Workflow Automation", icon: Workflow,
    tagline: "Automate the judgment calls, not just the clicks.",
    problem: "Traditional RPA breaks when inputs vary — an unexpected email, a scanned invoice, an ambiguous request — so exceptions still land on people.",
    solution: "We combine deterministic workflow steps with AI decision nodes that read, classify and route unstructured inputs, and fall back to people only when confidence is low.",
    features: ["Visual workflow builder", "Confidence-based routing", "Document understanding", "SLA & exception tracking", "Versioned, testable flows"],
    flow: ["Trigger", "Understand", "Decide", "Act"],
    benefits: [{ value: "Low-touch", label: "exception handling" }, { value: "Versioned", label: "flows with rollback" }, { value: "SLA", label: "visibility per step" }],
    cta: "Automate a process",
  },
  {
    id: "integration", index: "05", title: "Enterprise AI Integration", icon: Cable,
    tagline: "AI that works inside the systems you already run.",
    problem: "AI tools that live in a separate tab create copy-paste work and shadow data. Value appears only when AI reads and writes where work actually happens.",
    solution: "We connect models and agents to your ERP, CRM, ticketing and data platforms through governed connectors, with identity, permissions and data residency respected end to end.",
    features: ["Pre-built enterprise connectors", "SSO & permission inheritance", "Event-driven sync", "Data residency controls", "API gateway & rate limiting"],
    flow: ["Source systems", "Governed connectors", "AI layer", "Write-back"],
    benefits: [{ value: "40+", label: "connector patterns" }, { value: "Zero", label: "copy-paste hand-offs" }, { value: "Inherited", label: "user permissions" }],
    cta: "Plan an integration",
  },
  {
    id: "infrastructure", index: "06", title: "Managed AI Infrastructure", icon: ServerCog,
    tagline: "Production AI, operated like any other critical system.",
    problem: "Once AI is live, someone has to watch cost, latency, drift and incidents. Most teams don't have an on-call rotation for models.",
    solution: "We run your AI workloads with observability, cost controls, model routing and incident response — on your cloud or ours — with clear SLOs and monthly reviews.",
    features: ["Model routing & fallbacks", "Cost & token budgets", "Drift and quality monitoring", "Incident response runbooks", "Private / VPC deployment"],
    flow: ["Deploy", "Observe", "Alert", "Optimise"],
    benefits: [{ value: "SLO-backed", label: "operations" }, { value: "Budgeted", label: "token spend" }, { value: "Your cloud", label: "or managed" }],
    cta: "Talk to operations",
  },
];
