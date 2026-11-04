import { AnimatePresence, motion } from "framer-motion";
import { Bot, Brain, CheckCircle2, Database, Mail, ShieldCheck, Hash, Ticket, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * The hero's live "operations console": a ticket flowing through an
 * agent pipeline, with travelling signal packets and an event stream.
 * Pure SVG + SMIL for the packets (GPU-cheap), React for node state.
 * ------------------------------------------------------------------ */

type N = { id: string; x: number; y: number; label: string; sub: string; icon: typeof Bot; tone: "in" | "ai" | "gate" | "out" | "human" };

const NODES: N[] = [
  { id: "in", x: 70, y: 190, label: "Ticket #48213", sub: "Trigger · Helpdesk", icon: Ticket, tone: "in" },
  { id: "cls", x: 290, y: 190, label: "Classify intent", sub: "Swift S · 0.94", icon: Brain, tone: "ai" },
  { id: "gate", x: 500, y: 190, label: "Policy gate", sub: "PII · confidence", icon: ShieldCheck, tone: "gate" },
  { id: "agent", x: 715, y: 100, label: "Agent Atlas", sub: "Reason L · 4 tools", icon: Bot, tone: "ai" },
  { id: "human", x: 715, y: 290, label: "Human review", sub: "SLA 4h", icon: UserCheck, tone: "human" },
  { id: "crm", x: 925, y: 50, label: "CRM", sub: "write-back", icon: Database, tone: "out" },
  { id: "mail", x: 925, y: 150, label: "Reply sent", sub: "email", icon: Mail, tone: "out" },
  { id: "slack", x: 925, y: 290, label: "#escalations", sub: "slack", icon: Hash, tone: "out" },
];
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

const EDGES: [string, string][] = [["in", "cls"], ["cls", "gate"], ["gate", "agent"], ["gate", "human"], ["agent", "crm"], ["agent", "mail"], ["human", "slack"]];
/* Sequence the main path lights up in, per cycle */
const SEQUENCE = ["in", "cls", "gate", "agent", "crm", "mail"];

const path = (a: N, b: N) => {
  const x1 = a.x + 78, x2 = b.x - 78, mx = (x1 + x2) / 2;
  return `M${x1} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`;
};

const EVENTS = [
  { t: "trigger", m: "ticket.created  #48213  “Can’t add SSO users”" },
  { t: "ai", m: "classify → account.permissions  conf=0.94" },
  { t: "gate", m: "policy ✓  pii.redacted=2  route=agent" },
  { t: "ai", m: "atlas.plan  [kb.search, crm.read, draft]" },
  { t: "tool", m: "crm.read  org=northwind  seats=148/150" },
  { t: "ai", m: "atlas.reply  cited=3 docs  tone=ok" },
  { t: "done", m: "resolved  4.1s  tokens=2,318" },
  { t: "trigger", m: "ticket.created  #48214  “Refund for duplicate charge”" },
  { t: "gate", m: "policy → human  reason=billing.refund" },
  { t: "done", m: "escalated  summary attached" },
];

const toneStyles: Record<N["tone"], string> = {
  in: "text-ink-100",
  ai: "text-electric-400",
  gate: "text-signal",
  out: "text-ink-300",
  human: "text-violet-400",
};

export function PipelineVisual() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? SEQUENCE.length : 0);
  const [events, setEvents] = useState(EVENTS.slice(0, 3).map((e, i) => ({ ...e, id: i })));

  useEffect(() => {
    if (reduce) return;
    const s = setInterval(() => setStep((x) => (x + 1) % (SEQUENCE.length + 2)), 900);
    let k = 3;
    const ev = setInterval(() => {
      setEvents((prev) => [...prev.slice(-5), { ...EVENTS[k % EVENTS.length], id: k }]);
      k++;
    }, 1400);
    return () => { clearInterval(s); clearInterval(ev); };
  }, [reduce]);

  const lit = new Set(SEQUENCE.slice(0, step));

  return (
    <div className="grid lg:grid-cols-[1fr_300px]">
      <div className="relative overflow-hidden">
        <div className="grid-guides absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden />
        <svg viewBox="0 0 1000 360" className="relative block w-full" role="img" aria-label="Animated diagram: a support ticket is classified, passes a policy gate, and is resolved by an AI agent or escalated to a human.">
          <defs>
            <linearGradient id="edge-g" x1="0" x2="1">
              <stop offset="0" stopColor="#4C7DFF" stopOpacity=".15" />
              <stop offset=".5" stopColor="#8B5CF6" stopOpacity=".55" />
              <stop offset="1" stopColor="#4C7DFF" stopOpacity=".15" />
            </linearGradient>
            <radialGradient id="pkt-g">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".35" stopColor="#3EE6D2" />
              <stop offset="1" stopColor="#3EE6D2" stopOpacity="0" />
            </radialGradient>
          </defs>

          {EDGES.map(([a, b], i) => {
            const d = path(byId[a], byId[b]);
            const active = lit.has(a) && lit.has(b);
            return (
              <g key={a + b}>
                <path id={`p-${a}-${b}`} d={d} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1.5" />
                <path d={d} fill="none" stroke="url(#edge-g)" strokeWidth="1.5" strokeDasharray="4 8" className="animate-dash" />
                <path d={d} fill="none" stroke="#4C7DFF" strokeWidth="2" strokeLinecap="round" pathLength={1}
                  strokeDasharray="1" strokeDashoffset={active ? 0 : 1}
                  style={{ transition: "stroke-dashoffset .8s cubic-bezier(.22,.7,.2,1)", opacity: active ? 0.9 : 0 }} />
                {!reduce && (
                  <circle r="7" fill="url(#pkt-g)">
                    <animateMotion dur={`${2.4 + (i % 3) * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.35}s`}>
                      <mpath href={`#p-${a}-${b}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            );
          })}

          {NODES.map((n) => {
            const on = lit.has(n.id);
            const Icon = n.icon;
            const isEnd = n.tone === "out";
            const w = isEnd ? 132 : 156;
            return (
              <g key={n.id} transform={`translate(${n.x - (isEnd ? 54 : 78)} ${n.y - 26})`}>
                <rect width={w} height="52" rx="12" fill={on ? "rgba(76,125,255,.10)" : "rgba(13,18,30,.92)"} stroke={on ? "rgba(76,125,255,.55)" : "rgba(255,255,255,.09)"}
                  style={{ transition: "all .5s cubic-bezier(.22,.7,.2,1)" }} />
                <foreignObject x="10" y="10" width="32" height="32">
                  <div className={cn("grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[.04]", toneStyles[n.tone])}>
                    <Icon className="h-4 w-4" />
                  </div>
                </foreignObject>
                <text x="50" y="23" fill="#EDF0F7" fontSize="12.5" fontWeight="500" fontFamily="Inter Tight, sans-serif">{n.label}</text>
                <text x="50" y="39" fill="#8A93A8" fontSize="10" fontFamily="JetBrains Mono, monospace">{n.sub}</text>
                {on && n.id === "mail" && (
                  <circle cx={w - 10} cy="10" r="4" fill="#34D399"><animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite" /></circle>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="border-t border-white/[.06] bg-ink-950/50 p-4 lg:border-l lg:border-t-0" aria-label="Live event stream">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">Event stream</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-success">
            <span className="relative flex h-1.5 w-1.5"><span className="absolute inset-0 rounded-full bg-success animate-pulse-ring" /><span className="relative h-1.5 w-1.5 rounded-full bg-success" /></span>
            LIVE
          </span>
        </div>
        <ul className="space-y-1.5 font-mono text-[10.5px] leading-relaxed" aria-live="off">
          <AnimatePresence initial={false}>
            {events.map((e) => (
              <motion.li key={e.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
                className="flex gap-2 truncate">
                <span className={cn("shrink-0", e.t === "done" ? "text-success" : e.t === "gate" ? "text-signal" : e.t === "ai" ? "text-electric-400" : "text-ink-500")}>
                  {e.t === "done" ? <CheckCircle2 className="mt-0.5 inline h-3 w-3" /> : "›"}
                </span>
                <span className="truncate text-ink-300">{e.m}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </aside>
    </div>
  );
}
