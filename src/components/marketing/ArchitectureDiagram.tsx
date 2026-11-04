import { useReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export type LayerId = "ingestion" | "processing" | "orchestration" | "integration" | "monitoring" | "governance";

export const LAYERS: Record<LayerId, { title: string; short: string; parts: string[]; body: string; specs: [string, string][] }> = {
  integration: {
    title: "Integration layer", short: "Write back where work happens",
    parts: ["CRM", "ERP", "Ticketing", "Messaging", "Custom APIs"],
    body: "Governed connectors read and write to systems of record, inheriting each user's permissions. Event-driven sync keeps AI outputs and source data consistent.",
    specs: [["Connectors", "40+ patterns"], ["Auth", "OAuth · SSO · service principals"], ["Delivery", "Webhooks · queues · batch"]],
  },
  orchestration: {
    title: "Agent orchestration", short: "Plan, route and supervise",
    parts: ["Planner", "Tool router", "Memory", "Approvals", "Hand-off"],
    body: "Agents decompose requests into plans, call scoped tools, and pause for human approval when policy requires it. Multi-agent hand-offs carry full context.",
    specs: [["Execution", "Durable, resumable runs"], ["Controls", "Step limits · approval gates"], ["Traces", "Every step replayable"]],
  },
  processing: {
    title: "AI processing", short: "Models, retrieval and evaluation",
    parts: ["Model gateway", "Retrieval", "Classifiers", "Extraction", "Evals"],
    body: "A model-agnostic gateway routes each task to the right model by cost, latency and quality, grounded by retrieval over your indexed knowledge.",
    specs: [["Routing", "Cost / latency aware"], ["Grounding", "Hybrid vector + keyword"], ["Quality", "Offline + online evals"]],
  },
  ingestion: {
    title: "Data ingestion", short: "Streams, documents and APIs",
    parts: ["Connectors", "OCR", "Chunking", "Embeddings", "CDC"],
    body: "Structured and unstructured data is pulled in, normalised, de-identified and indexed — continuously, with lineage back to every source record.",
    specs: [["Sources", "Databases · files · SaaS"], ["Formats", "PDF · email · images · tables"], ["Freshness", "Streaming or scheduled"]],
  },
  governance: {
    title: "Security & governance", short: "Policy across every layer",
    parts: ["RBAC", "PII redaction", "Policy engine", "Audit log", "Residency"],
    body: "Policies are enforced at every layer: who can run which agent, what data can reach which model, and where it may be stored. Every action lands in an immutable audit log.",
    specs: [["Identity", "SSO · SCIM · RBAC"], ["Data", "Redaction · residency · retention"], ["Audit", "Immutable, exportable"]],
  },
  monitoring: {
    title: "Analytics & monitoring", short: "Cost, latency and quality",
    parts: ["Tracing", "Cost budgets", "Drift", "Alerts", "Dashboards"],
    body: "Every run emits traces, token cost and quality signals. Budgets and alerts catch regressions before users do, and dashboards show business outcomes, not just uptime.",
    specs: [["Signals", "Latency · cost · quality"], ["Alerts", "Slack · PagerDuty · email"], ["SLOs", "Per workflow"]],
  },
};

const STACK: { id: LayerId; y: number }[] = [
  { id: "integration", y: 40 },
  { id: "orchestration", y: 150 },
  { id: "processing", y: 260 },
  { id: "ingestion", y: 370 },
];
const SOURCES = ["Databases", "Documents", "SaaS apps", "Events", "Email"];

export function ArchitectureDiagram({ selected, onSelect, className }: { selected?: LayerId | null; onSelect?: (id: LayerId) => void; className?: string }) {
  const reduce = useReducedMotion();
  const interactive = !!onSelect;

  const layerProps = (id: LayerId) => interactive ? {
    role: "button" as const, tabIndex: 0, "aria-pressed": selected === id, "aria-label": LAYERS[id].title,
    onClick: () => onSelect!(id),
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect!(id); } },
    style: { cursor: "pointer", outline: "none" },
  } : {};
  const dim = (id: LayerId) => selected && selected !== id;

  return (
    <svg viewBox="0 0 1000 560" className={cn("block w-full", className)} role={interactive ? "group" : "img"} aria-label="NEXORA platform architecture: data flows up from sources through ingestion, AI processing, agent orchestration and the integration layer, with governance and monitoring spanning every layer.">
      <defs>
        <linearGradient id="arch-layer" x1="0" x2="1">
          <stop offset="0" stopColor="#121928" /><stop offset="1" stopColor="#0D121E" />
        </linearGradient>
        <linearGradient id="arch-sel" x1="0" x2="1">
          <stop offset="0" stopColor="rgba(76,125,255,.22)" /><stop offset="1" stopColor="rgba(139,92,246,.14)" />
        </linearGradient>
        <radialGradient id="arch-pkt"><stop offset="0" stopColor="#fff" /><stop offset=".4" stopColor="#3EE6D2" /><stop offset="1" stopColor="#3EE6D2" stopOpacity="0" /></radialGradient>
      </defs>

      {/* Vertical data bus */}
      {[300, 500, 700].map((x, i) => (
        <g key={x}>
          <path id={`bus-${i}`} d={`M${x} 520 L${x} 40`} stroke="rgba(255,255,255,.07)" strokeWidth="1.5" />
          <path d={`M${x} 520 L${x} 40`} stroke="rgba(76,125,255,.45)" strokeWidth="1.5" strokeDasharray="3 9" className="animate-dash" style={{ animationDirection: "reverse" }} />
          {!reduce && (
            <circle r="6" fill="url(#arch-pkt)">
              <animateMotion dur={`${3 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.8}s`}><mpath href={`#bus-${i}`} /></animateMotion>
            </circle>
          )}
        </g>
      ))}

      {/* Side rails taps */}
      {STACK.map(({ y }) => (
        <g key={y}>
          <path d={`M108 ${y + 40} L160 ${y + 40}`} stroke="#3EE6D2" strokeOpacity=".5" strokeWidth="1.2" strokeDasharray="2 5" className="animate-dash" />
          <path d={`M840 ${y + 40} L892 ${y + 40}`} stroke="#8B5CF6" strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="2 5" className="animate-dash" />
        </g>
      ))}

      {/* Governance rail */}
      <g {...layerProps("governance")} opacity={dim("governance") ? 0.35 : 1} style={{ transition: "opacity .3s", ...(interactive ? { cursor: "pointer" } : {}) }}>
        <rect x="40" y="40" width="68" height="410" rx="14" fill={selected === "governance" ? "url(#arch-sel)" : "rgba(62,230,210,.05)"} stroke={selected === "governance" ? "#3EE6D2" : "rgba(62,230,210,.3)"} />
        <text transform="translate(80 245) rotate(-90)" textAnchor="middle" fill="#3EE6D2" fontSize="12" fontFamily="JetBrains Mono, monospace" letterSpacing="2">SECURITY · GOVERNANCE</text>
      </g>
      {/* Monitoring rail */}
      <g {...layerProps("monitoring")} opacity={dim("monitoring") ? 0.35 : 1} style={{ transition: "opacity .3s", ...(interactive ? { cursor: "pointer" } : {}) }}>
        <rect x="892" y="40" width="68" height="410" rx="14" fill={selected === "monitoring" ? "url(#arch-sel)" : "rgba(139,92,246,.06)"} stroke={selected === "monitoring" ? "#A78BFA" : "rgba(139,92,246,.35)"} />
        <text transform="translate(932 245) rotate(90)" textAnchor="middle" fill="#A78BFA" fontSize="12" fontFamily="JetBrains Mono, monospace" letterSpacing="2">ANALYTICS · MONITORING</text>
      </g>

      {/* Core stack */}
      {STACK.map(({ id, y }, i) => {
        const L = LAYERS[id];
        const sel = selected === id;
        return (
          <g key={id} {...layerProps(id)} opacity={dim(id) ? 0.35 : 1} style={{ transition: "opacity .3s", ...(interactive ? { cursor: "pointer" } : {}) }}>
            <rect x="160" y={y} width="680" height="80" rx="14" fill={sel ? "url(#arch-sel)" : "url(#arch-layer)"} stroke={sel ? "#4C7DFF" : "rgba(255,255,255,.09)"} strokeWidth={sel ? 1.5 : 1} />
            <text x="184" y={y + 30} fill="#5A6580" fontSize="10.5" fontFamily="JetBrains Mono, monospace">L{4 - i}</text>
            <text x="212" y={y + 31} fill="#EDF0F7" fontSize="15" fontWeight="500" fontFamily="Inter Tight, sans-serif">{L.title}</text>
            <text x="212" y={y + 52} fill="#8A93A8" fontSize="11.5" fontFamily="Inter Tight, sans-serif">{L.short}</text>
            {L.parts.slice(0, 4).map((p, j) => {
              const w = p.length * 6.4 + 22;
              const x = 820 - (L.parts.slice(j, 4).reduce((s, q) => s + q.length * 6.4 + 30, 0));
              return (
                <g key={p}>
                  <rect x={x} y={y + 26} width={w} height="26" rx="13" fill="rgba(255,255,255,.035)" stroke="rgba(255,255,255,.08)" />
                  <text x={x + w / 2} y={y + 43} textAnchor="middle" fill="#B8BFCE" fontSize="10.5" fontFamily="JetBrains Mono, monospace">{p}</text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Sources */}
      {SOURCES.map((s, i) => {
        const x = 160 + i * 140;
        return (
          <g key={s}>
            <rect x={x} y="490" width="120" height="34" rx="17" fill="#090D16" stroke="rgba(255,255,255,.1)" />
            <text x={x + 60} y="511" textAnchor="middle" fill="#8A93A8" fontSize="11" fontFamily="JetBrains Mono, monospace">{s}</text>
          </g>
        );
      })}
      <text x="500" y="474" textAnchor="middle" fill="#5A6580" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="2">YOUR DATA SOURCES</text>
    </svg>
  );
}
