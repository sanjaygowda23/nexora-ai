import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { generateLogs, initialAgents, type ActivityLog, type Agent } from "@/data/appMock";
import { readStorage, writeStorage } from "@/hooks/useLocalStorage";
import { uid } from "@/lib/utils";
import { initialWorkflows, type SavedWorkflow } from "@/components/app/workflow/templates";

/* ------------------------------------------------------------------ *
 * Global demo state for the SaaS app. Everything persists to
 * localStorage under a versioned namespace so the demo survives reloads.
 * ------------------------------------------------------------------ */

const NS = "alder:v1:";

export type Theme = "dark" | "light" | "system";
export interface Settings {
  profile: { name: string; email: string; title: string; timezone: string };
  workspace: { name: string; slug: string; region: string; defaultModel: string };
  notifications: { agentFailures: boolean; weeklyDigest: boolean; approvals: boolean; productUpdates: boolean; channel: "email" | "slack" | "both" };
  appearance: { theme: Theme; density: "comfortable" | "compact"; reduceMotion: boolean };
  security: { mfa: boolean; sessionTimeout: string; ipAllowlist: boolean; auditExport: boolean };
}

export const defaultSettings: Settings = {
  profile: { name: "Alex Morgan", email: "alex.morgan@alder.example", title: "Head of AI Operations", timezone: "Asia/Kolkata" },
  workspace: { name: "Acme Operations", slug: "acme-ops", region: "ap-south-1", defaultModel: "alder-reason-l" },
  notifications: { agentFailures: true, weeklyDigest: true, approvals: true, productUpdates: false, channel: "both" },
  appearance: { theme: "dark", density: "comfortable", reduceMotion: false },
  security: { mfa: true, sessionTimeout: "8h", ipAllowlist: false, auditExport: true },
};

interface Store {
  session: { signedIn: boolean };
  signIn: () => void;
  signOut: () => void;

  agents: Agent[];
  createAgent: (a: Omit<Agent, "id" | "runs" | "successRate" | "avgLatencyMs" | "costUsd" | "createdAt" | "lastRunAt">) => Agent;
  updateAgent: (id: string, patch: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;

  workflows: SavedWorkflow[];
  saveWorkflow: (wf: SavedWorkflow) => void;
  deleteWorkflow: (id: string) => void;

  logs: ActivityLog[];
  pushLog: (l: Omit<ActivityLog, "id" | "timestamp">) => void;

  settings: Settings;
  setSettings: (s: Settings) => void;

  resetDemo: () => void;
}

const Ctx = createContext<Store | null>(null);

function usePersisted<T>(key: string, init: () => T) {
  const [v, setV] = useState<T>(() => readStorage(NS + key, init()));
  useEffect(() => writeStorage(NS + key, v), [key, v]);
  return [v, setV] as const;
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = usePersisted("session", () => ({ signedIn: false }));
  const [agents, setAgents] = usePersisted<Agent[]>("agents", () => initialAgents);
  const [workflows, setWorkflows] = usePersisted<SavedWorkflow[]>("workflows", () => initialWorkflows);
  const [extraLogs, setExtraLogs] = usePersisted<ActivityLog[]>("logs", () => []);
  const [settings, setSettings] = usePersisted<Settings>("settings", () => defaultSettings);

  const baseLogs = useMemo(() => generateLogs(), []);
  const logs = useMemo(() => [...extraLogs, ...baseLogs], [extraLogs, baseLogs]);

  const signIn = useCallback(() => setSession({ signedIn: true }), [setSession]);
  const signOut = useCallback(() => setSession({ signedIn: false }), [setSession]);

  const createAgent: Store["createAgent"] = useCallback((a) => {
    const now = new Date().toISOString();
    const agent: Agent = { ...a, id: uid("agt"), runs: 0, successRate: 0, avgLatencyMs: 0, costUsd: 0, createdAt: now, lastRunAt: now };
    setAgents((prev) => [agent, ...prev]);
    return agent;
  }, [setAgents]);

  const updateAgent = useCallback((id: string, patch: Partial<Agent>) => setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a))), [setAgents]);
  const deleteAgent = useCallback((id: string) => setAgents((prev) => prev.filter((a) => a.id !== id)), [setAgents]);

  const saveWorkflow = useCallback((wf: SavedWorkflow) =>
    setWorkflows((prev) => (prev.some((w) => w.id === wf.id) ? prev.map((w) => (w.id === wf.id ? wf : w)) : [wf, ...prev])), [setWorkflows]);
  const deleteWorkflow = useCallback((id: string) => setWorkflows((prev) => prev.filter((w) => w.id !== id)), [setWorkflows]);

  const pushLog = useCallback((l: Omit<ActivityLog, "id" | "timestamp">) =>
    setExtraLogs((prev) => [{ ...l, id: uid("log"), timestamp: new Date().toISOString() }, ...prev].slice(0, 200)), [setExtraLogs]);

  const resetDemo = useCallback(() => {
    setAgents(initialAgents);
    setWorkflows(initialWorkflows);
    setExtraLogs([]);
    setSettings(defaultSettings);
  }, [setAgents, setWorkflows, setExtraLogs, setSettings]);

  const value = useMemo<Store>(() => ({
    session, signIn, signOut, agents, createAgent, updateAgent, deleteAgent,
    workflows, saveWorkflow, deleteWorkflow, logs, pushLog, settings, setSettings, resetDemo,
  }), [session, signIn, signOut, agents, createAgent, updateAgent, deleteAgent, workflows, saveWorkflow, deleteWorkflow, logs, pushLog, settings, setSettings, resetDemo]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}

/** Simulates network latency so loading skeletons are genuinely exercised. */
export function useSimulatedLoad(ms = 650, deps: unknown[] = []) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return loading;
}
