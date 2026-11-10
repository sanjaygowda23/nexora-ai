import { motion } from "framer-motion";
import { Bot, LineChart, ShieldCheck, Workflow } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { usePageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/AppStore";

/** Demo gate for the protected-style console routes. No credentials are collected. */
export default function SignIn() {
  usePageMeta("Sign in to the console");
  const { session, signIn } = useAppStore();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/app/dashboard";
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.documentElement.classList.add("dark"); }, []);
  useEffect(() => { if (session.signedIn) navigate(from, { replace: true }); }, [session.signedIn, from, navigate]);

  const enter = () => {
    setLoading(true);
    setTimeout(() => { signIn(); toast.success("Welcome to the demo workspace"); }, 700);
  };

  return (
    <div className="relative grid min-h-dvh overflow-hidden bg-ink-950 text-white lg:grid-cols-2">
      <div className="relative flex flex-col justify-between p-8 md:p-12">
        <Link to="/" className="text-white"><Logo /></Link>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto w-full max-w-sm py-16">
          <p className="eyebrow text-signal">Operations console</p>
          <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em]">Enter the demo workspace</h1>
          <p className="mt-3 text-[15px] text-ink-400">Explore a fully interactive console with simulated data. Everything you change is saved in this browser only.</p>
          <Button size="lg" variant="primary" signal={!loading} disabled={loading} className="mt-8 w-full" onClick={enter} autoFocus>
            {loading ? "Preparing workspace…" : "Continue as demo user"}
          </Button>
          <p className="mt-4 text-center text-[12.5px] text-ink-500">No account or password needed.</p>
        </motion.div>
        <Link to="/" className="text-[13px] text-ink-500 hover:text-white">← Back to website</Link>
      </div>
      <div className="relative hidden overflow-hidden border-l border-white/[.06] bg-ink-900 lg:block">
        <div className="grid-guides absolute inset-0 opacity-60" aria-hidden />
        <ul className="relative flex h-full flex-col justify-center gap-4 p-16">
          {[
            [Bot, "Agent registry", "Create, configure and monitor AI agents"],
            [Workflow, "Workflow builder", "Drag, connect and execute node-based flows"],
            [LineChart, "Analytics", "Usage, cost and performance over time"],
            [ShieldCheck, "Governance", "Approvals, audit trail and security settings"],
          ].map(([I, t, d], i) => {
            const Icon = I as typeof Bot;
            return (
              <motion.li key={t as string} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                className="glass flex items-center gap-4 rounded-2xl p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[.06] text-brand-400"><Icon className="h-5 w-5" /></span>
                <span><span className="block text-[15px] font-medium">{t as string}</span><span className="text-[13px] text-ink-400">{d as string}</span></span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
