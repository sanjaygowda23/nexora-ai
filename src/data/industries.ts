import { Building2, Factory, HeartPulse, Landmark, Layers, ShoppingBag, type LucideIcon } from "lucide-react";

export type Industry = {
  id: string; name: string; icon: LucideIcon; headline: string; context: string;
  pressures: string[];
  useCases: { title: string; body: string; metric: string }[];
  solutions: string[]; // solution ids
  compliance: string[];
};

export const industries: Industry[] = [
  {
    id: "healthcare", name: "Healthcare", icon: HeartPulse,
    headline: "Give clinicians their time back.",
    context: "Clinical and administrative teams spend hours on documentation, prior authorisations and scheduling. AI can absorb that load — provided every output is explainable and patient data never leaves a governed boundary.",
    pressures: ["Clinician burnout from documentation", "Prior-auth backlogs delaying care", "Strict PHI handling requirements"],
    useCases: [
      { title: "Ambient clinical notes", body: "Draft structured visit notes from consented conversations for clinician review and sign-off.", metric: "Notes drafted for review" },
      { title: "Prior authorisation agent", body: "Assemble payer-specific packets from the EHR, flag missing evidence, and track submissions.", metric: "Packets pre-assembled" },
      { title: "Intelligent scheduling", body: "Predict no-shows and fill gaps from waitlists while respecting provider preferences.", metric: "Slots back-filled" },
    ],
    solutions: ["agents", "development", "integration"],
    compliance: ["HIPAA-aligned controls", "PHI redaction", "Audit trails"],
  },
  {
    id: "finance", name: "Financial Services", icon: Landmark,
    headline: "Faster decisions, fully auditable.",
    context: "Banks, insurers and fintechs run on documents and rules. AI can read, reconcile and reason across them — but regulators expect every decision to be traceable and every model to be governed.",
    pressures: ["Manual KYC and onboarding", "Reconciliation exceptions", "Model risk management obligations"],
    useCases: [
      { title: "KYC document review", body: "Extract and cross-check identity and corporate documents, routing only discrepancies to analysts.", metric: "Cases auto-cleared" },
      { title: "Reconciliation agent", body: "Match transactions across ledgers, explain breaks, and propose journal entries for approval.", metric: "Breaks explained" },
      { title: "Claims triage", body: "Classify claims by complexity and fraud signals to route them to the right handler first time.", metric: "Claims routed" },
    ],
    solutions: ["agents", "automation", "infrastructure"],
    compliance: ["Model inventory", "Decision lineage", "Data residency"],
  },
  {
    id: "manufacturing", name: "Manufacturing", icon: Factory,
    headline: "From sensor noise to shop-floor action.",
    context: "Plants generate vast operational data that rarely reaches decisions in time. AI connects machine telemetry, maintenance logs and supplier signals into actions planners can trust.",
    pressures: ["Unplanned downtime", "Supplier volatility", "Tribal knowledge retiring with staff"],
    useCases: [
      { title: "Predictive maintenance", body: "Correlate vibration, temperature and work-order history to schedule interventions before failure.", metric: "Alerts with root-cause context" },
      { title: "Maintenance copilot", body: "Technicians ask questions of manuals and past repairs in plain language, on the floor.", metric: "Answers cited to manuals" },
      { title: "Supplier risk monitor", body: "Watch news, lead times and quality data to flag at-risk parts early.", metric: "Risks surfaced" },
    ],
    solutions: ["development", "integration", "infrastructure"],
    compliance: ["OT network isolation", "On-prem deployment", "Role-based access"],
  },
  {
    id: "saas", name: "SaaS & Technology", icon: Layers,
    headline: "Ship AI features your customers actually use.",
    context: "Software companies need AI inside the product and inside operations — support, success and engineering. Speed matters, but so does cost per request and reliability at scale.",
    pressures: ["Support volume scaling with users", "AI feature cost overruns", "Pressure to ship AI roadmaps fast"],
    useCases: [
      { title: "Tier-1 support agent", body: "Resolve common tickets from docs and account context; hand off with a full summary when needed.", metric: "Tickets resolved end-to-end" },
      { title: "In-product copilot", body: "Embed a grounded assistant that understands each customer's workspace and permissions.", metric: "Grounded answers" },
      { title: "Churn signal analysis", body: "Combine usage, sentiment and billing data to brief CSMs on accounts at risk.", metric: "Accounts flagged" },
    ],
    solutions: ["agents", "development", "infrastructure"],
    compliance: ["Tenant isolation", "Token budgets", "SOC 2-aligned logging"],
  },
  {
    id: "retail", name: "Retail", icon: ShoppingBag,
    headline: "Personal at scale, precise on stock.",
    context: "Retailers balance personalised experiences with tight inventory margins. AI helps merchandisers, marketers and store teams act on demand signals in hours rather than weeks.",
    pressures: ["Stock-outs and overstock", "Generic, low-converting content", "Seasonal support spikes"],
    useCases: [
      { title: "Demand sensing", body: "Blend POS, weather and promotion data to refine store-level forecasts daily.", metric: "Forecasts refreshed daily" },
      { title: "Product content studio", body: "Generate on-brand descriptions and attributes for thousands of SKUs with review queues.", metric: "SKUs enriched" },
      { title: "Order support agent", body: "Handle where-is-my-order, returns and exchanges across channels.", metric: "Contacts self-served" },
    ],
    solutions: ["automation", "agents", "integration"],
    compliance: ["PCI scope isolation", "Brand guardrails", "Consent management"],
  },
  {
    id: "construction", name: "Construction", icon: Building2,
    headline: "See project risk before it becomes cost.",
    context: "Projects live in RFIs, submittals, schedules and daily logs scattered across tools. AI reads across them to surface schedule slip, safety and cost risk while there's still time to act.",
    pressures: ["Late discovery of schedule slip", "Document overload for PMs", "Safety incidents and claims"],
    useCases: [
      { title: "Risk intelligence", body: "Score every active project weekly on schedule, cost and safety signals pulled from field data.", metric: "Projects scored weekly" },
      { title: "RFI & submittal assistant", body: "Draft responses by retrieving relevant specs, drawings references and prior answers.", metric: "Drafts prepared" },
      { title: "Daily log summarisation", body: "Turn site logs and photos into structured progress and issue reports.", metric: "Reports structured" },
    ],
    solutions: ["development", "automation", "consulting"],
    compliance: ["Project-level permissions", "Document retention", "Field-ready offline sync"],
  },
];
