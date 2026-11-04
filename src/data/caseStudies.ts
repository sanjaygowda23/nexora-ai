/**
 * ILLUSTRATIVE CASE STUDIES.
 * Companies, people and figures below are fictional and exist to demonstrate
 * page design. They are not verified customer outcomes.
 */
export type CaseStudy = {
  id: string; title: string; client: string; industry: string; duration: string;
  summary: string; accent: string;
  background: string; problem: string; solution: string;
  architecture: { layer: string; detail: string }[];
  process: { phase: string; weeks: string; detail: string }[];
  results: { value: number; suffix: string; prefix?: string; label: string; decimals?: number }[];
  lessons: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "support-automation",
    title: "Enterprise Support Automation",
    client: "Northwind Labs",
    industry: "SaaS & Technology",
    duration: "14 weeks",
    accent: "#4C7DFF",
    summary: "A tier-1 support agent grounded in product docs and account context, with human hand-off built in.",
    background: "Northwind Labs is a fictional B2B analytics platform with roughly 4,000 business customers. Its 60-person support team handled about 38,000 tickets per month across email, chat and an in-app widget.",
    problem: "Ticket volume was growing faster than headcount. Around 60% of tickets were repeat questions — permissions, billing dates, integration set-up — yet each still waited in the same queue as complex escalations. Median first response had drifted past nine hours.",
    solution: "We deployed a support agent that reads each ticket, retrieves relevant documentation and the customer's account configuration, and either resolves the request with cited answers or hands off to a specialist with a structured summary, suggested reply and confidence score.",
    architecture: [
      { layer: "Ingestion", detail: "Help-centre articles, release notes and 18 months of resolved tickets indexed nightly." },
      { layer: "Reasoning", detail: "Retrieval-grounded agent with tool access to read-only account APIs." },
      { layer: "Guardrails", detail: "Confidence threshold, PII redaction, refusal policy for billing changes." },
      { layer: "Integration", detail: "Ticketing system webhook in; replies and internal notes written back." },
      { layer: "Monitoring", detail: "Resolution quality sampled daily; CSAT tracked per intent." },
    ],
    process: [
      { phase: "Discover", weeks: "Wk 1–2", detail: "Clustered 90 days of tickets into 42 intents and scored automation potential." },
      { phase: "Design", weeks: "Wk 3–5", detail: "Defined hand-off rules, tone guidelines and an evaluation set of 600 real tickets." },
      { phase: "Deploy", weeks: "Wk 6–10", detail: "Shadow mode, then 10% → 50% → 100% of eligible intents." },
      { phase: "Optimise", weeks: "Wk 11–14", detail: "Weekly review of low-confidence cases; docs gaps fed back to content team." },
    ],
    results: [
      { value: 46, suffix: "%", label: "of tickets resolved without hand-off" },
      { value: 9.2, suffix: "h → 4m", label: "median first response", decimals: 1 },
      { value: 4.6, suffix: "/5", label: "CSAT on agent-resolved tickets", decimals: 1 },
      { value: 31, suffix: "%", label: "specialist time redirected to escalations" },
    ],
    lessons: [
      "Shadow mode built trust faster than any accuracy chart — agents saw the drafts before customers did.",
      "Hand-off quality mattered as much as resolution rate; summaries cut specialist handling time noticeably.",
      "Most wrong answers traced back to outdated docs, so the content team became part of the loop.",
    ],
  },
  {
    id: "marketing-intelligence",
    title: "Marketing Workflow Intelligence",
    client: "Solace Retail",
    industry: "Retail",
    duration: "10 weeks",
    accent: "#8B5CF6",
    summary: "An AI content pipeline producing on-brand product copy and campaign variants with review built in.",
    background: "Solace Retail is a fictional omnichannel home-goods retailer launching around 1,200 new SKUs per season and running weekly campaigns across email, paid social and onsite.",
    problem: "Product pages launched with thin, inconsistent copy, and campaign teams spent most of each week rewriting variants by channel. Brand reviews became a bottleneck, so launches slipped and paid campaigns reused stale creative.",
    solution: "We built a workflow that ingests supplier specs, generates attributes and descriptions in the brand's voice, creates channel-specific campaign variants, and routes everything through a review queue that learns from editor changes.",
    architecture: [
      { layer: "Ingestion", detail: "Supplier spreadsheets and PIM records normalised into a product schema." },
      { layer: "Generation", detail: "Brand-voice model guided by a style guide and 300 approved examples." },
      { layer: "Workflow", detail: "Conditional routing by category, risk terms and confidence." },
      { layer: "Review", detail: "Editor queue with inline diff; edits captured as training signal." },
      { layer: "Activation", detail: "Approved copy published to PIM, email and ad platforms via API." },
    ],
    process: [
      { phase: "Discover", weeks: "Wk 1–2", detail: "Audited 5,000 existing pages and mapped the review workflow." },
      { phase: "Design", weeks: "Wk 3–4", detail: "Codified the brand voice into rules, examples and banned claims." },
      { phase: "Deploy", weeks: "Wk 5–8", detail: "Rolled out category by category, starting with low-risk textiles." },
      { phase: "Optimise", weeks: "Wk 9–10", detail: "Tuned prompts on editor diffs; added A/B tracking for variants." },
    ],
    results: [
      { value: 3.4, suffix: "×", label: "more SKUs launched with full content", decimals: 1 },
      { value: 72, suffix: "%", label: "of drafts approved with light edits" },
      { value: 5, suffix: " → 1.5 days", label: "campaign variant turnaround" },
      { value: 18, suffix: "%", label: "lift in illustrative email CTR test" },
    ],
    lessons: [
      "Codifying the brand voice was the real project; the model was the easy part.",
      "Editors trusted the system once they could see a diff, not just a final draft.",
      "Starting with low-risk categories gave the team room to calibrate before regulated claims.",
    ],
  },
  {
    id: "construction-risk",
    title: "Construction Risk Intelligence",
    client: "Ironvale Build",
    industry: "Construction",
    duration: "16 weeks",
    accent: "#3EE6D2",
    summary: "Weekly project risk scoring from field logs, RFIs and schedules — surfaced before cost overruns.",
    background: "Ironvale Build is a fictional general contractor running around 70 concurrent commercial projects. Project data lived across scheduling software, document control, daily logs and spreadsheets.",
    problem: "Leadership learned about schedule slip and safety trends at monthly reviews, typically weeks after the signals first appeared in field notes. PMs were overloaded with documents and lacked a consistent way to compare risk across projects.",
    solution: "We built a risk intelligence layer that reads daily logs, RFIs, submittals and schedule updates, extracts risk signals, scores each project weekly on schedule, cost and safety, and explains every score with linked evidence.",
    architecture: [
      { layer: "Ingestion", detail: "Connectors to scheduling, document control and mobile daily-log apps." },
      { layer: "Extraction", detail: "Models tag delays, weather impacts, change orders and safety observations." },
      { layer: "Scoring", detail: "Transparent weighted model calibrated against 3 years of project outcomes." },
      { layer: "Explanation", detail: "Each score links to the source entries that moved it." },
      { layer: "Delivery", detail: "Monday portfolio brief plus alerts to PMs when a project crosses thresholds." },
    ],
    process: [
      { phase: "Discover", weeks: "Wk 1–3", detail: "Interviewed PMs and safety leads; labelled 400 historical risk events." },
      { phase: "Design", weeks: "Wk 4–7", detail: "Built the signal taxonomy and an explainable scoring model." },
      { phase: "Deploy", weeks: "Wk 8–12", detail: "Piloted on 12 projects, then portfolio-wide." },
      { phase: "Optimise", weeks: "Wk 13–16", detail: "Calibrated thresholds with PM feedback to cut alert fatigue." },
    ],
    results: [
      { value: 3.5, suffix: " wks", label: "earlier average detection of schedule risk", decimals: 1 },
      { value: 70, suffix: "", label: "projects scored every week" },
      { value: 6, suffix: "h", label: "PM time saved per week on reporting" },
      { value: 22, suffix: "%", label: "fewer recordable-incident precursors (pilot)" },
    ],
    lessons: [
      "Explainability was non-negotiable — PMs ignored scores until every number linked to evidence.",
      "Field data quality improved once crews saw their logs drive decisions.",
      "Alert thresholds needed per-project-type calibration to avoid fatigue.",
    ],
  },
];

export const testimonials = [
  {
    quote: "The difference was governance. Every agent action is logged and replayable, which is what got our risk team comfortable moving past pilots.",
    name: "Priya Raman", role: "VP Operations", company: "Halcyon Bank",
  },
  {
    quote: "They spent the first two weeks on our process, not on models. The roadmap they left us is still the one we're executing against.",
    name: "Marcus Ellery", role: "Chief Digital Officer", company: "Brightline Mfg",
  },
  {
    quote: "Shadow mode was the unlock. Our support leads reviewed drafts for a month before a single customer saw one.",
    name: "Lena Okafor", role: "Head of Support", company: "Northwind Labs",
  },
];
