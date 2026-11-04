import {
  Bot, BrainCircuit, Building2, Cable, Cpu, Factory, HeartPulse, Landmark, Layers, LineChart,
  Network, ServerCog, ShieldCheck, ShoppingBag, Workflow, Database,
  type LucideIcon,
} from "lucide-react";

export type NavLink = { label: string; to: string; description?: string; icon?: LucideIcon };
export type NavGroup = { label: string; to: string; items?: NavLink[]; feature?: { title: string; body: string; to: string } };

export const mainNav: NavGroup[] = [
  {
    label: "Solutions",
    to: "/solutions",
    items: [
      { label: "AI Consulting", to: "/solutions#consulting", description: "Strategy, roadmaps, ROI modelling", icon: BrainCircuit },
      { label: "Custom AI Development", to: "/solutions#development", description: "Models and apps built for your data", icon: Cpu },
      { label: "AI Agents", to: "/solutions#agents", description: "Autonomous, supervised digital workers", icon: Bot },
      { label: "Workflow Automation", to: "/solutions#automation", description: "End-to-end process orchestration", icon: Workflow },
      { label: "Enterprise Integration", to: "/solutions#integration", description: "Connect AI to ERP, CRM, data lakes", icon: Cable },
      { label: "Managed Infrastructure", to: "/solutions#infrastructure", description: "Run, scale and monitor in production", icon: ServerCog },
    ],
    feature: { title: "Not sure where to start?", body: "A two-week AI readiness sprint maps your highest-value opportunities.", to: "/contact" },
  },
  {
    label: "Platform",
    to: "/platform",
    items: [
      { label: "Data Ingestion", to: "/platform#ingestion", description: "Streams, documents, APIs", icon: Database },
      { label: "Agent Orchestration", to: "/platform#orchestration", description: "Plan, route, supervise", icon: Network },
      { label: "Security & Governance", to: "/platform#governance", description: "Policy, audit, PII controls", icon: ShieldCheck },
      { label: "Analytics & Monitoring", to: "/platform#monitoring", description: "Cost, latency, quality", icon: LineChart },
    ],
    feature: { title: "Open the live console", body: "Explore the operations dashboard and build a workflow in the browser.", to: "/app/dashboard" },
  },
  {
    label: "Industries",
    to: "/industries",
    items: [
      { label: "Healthcare", to: "/industries#healthcare", icon: HeartPulse },
      { label: "Financial Services", to: "/industries#finance", icon: Landmark },
      { label: "Manufacturing", to: "/industries#manufacturing", icon: Factory },
      { label: "SaaS & Technology", to: "/industries#saas", icon: Layers },
      { label: "Retail", to: "/industries#retail", icon: ShoppingBag },
      { label: "Construction", to: "/industries#construction", icon: Building2 },
    ],
  },
  { label: "Case Studies", to: "/case-studies" },
];

export const footerNav = [
  { title: "Solutions", links: mainNav[0].items!.map(({ label, to }) => ({ label, to })) },
  { title: "Platform", links: [...mainNav[1].items!.map(({ label, to }) => ({ label, to })), { label: "Live console", to: "/app/dashboard" }] },
  { title: "Industries", links: mainNav[2].items!.map(({ label, to }) => ({ label, to })) },
  {
    title: "Company",
    links: [
      { label: "Case studies", to: "/case-studies" },
      { label: "Book a consultation", to: "/contact" },
      { label: "Workflow builder", to: "/app/workflows" },
      { label: "Agent registry", to: "/app/agents" },
    ],
  },
];

/** Fictional brands used only to demonstrate a "trusted by" layout. */
export const demoBrands = [
  { name: "Northwind Labs", glyph: "triangle" },
  { name: "Halcyon Bank", glyph: "bars" },
  { name: "Meridian Health", glyph: "plus" },
  { name: "Arcfield", glyph: "arc" },
  { name: "Quantis", glyph: "ring" },
  { name: "Brightline Mfg", glyph: "chevron" },
  { name: "Solace Retail", glyph: "dot" },
  { name: "Ironvale Build", glyph: "square" },
] as const;
