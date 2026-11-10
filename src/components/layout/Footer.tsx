import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { footerNav } from "@/data/site";

export function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid work email.");
    setError(null);
    setEmail("");
    toast.success("You're on the list", { description: "The monthly AI operations briefing will land in your inbox." });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/[.06] bg-ink-950">
      <div className="container grid gap-14 pb-10 pt-20 lg:grid-cols-[1.1fr_2fr]">
        <div>
          <Logo className="text-white" />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-ink-400">Intelligence that moves business forward. Enterprise AI agents, automation and integration — governed end to end.</p>
          <form onSubmit={subscribe} className="mt-8 max-w-sm" noValidate>
            <label htmlFor="footer-email" className="eyebrow">Monthly briefing</label>
            <div className="mt-3 flex gap-2 rounded-full border border-white/10 bg-white/[.03] p-1 focus-within:border-brand/50">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-invalid={!!error}
                aria-describedby={error ? "footer-email-err" : undefined}
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-ink-500 focus:outline-none"
              />
              <Button type="submit" size="sm">Subscribe</Button>
            </div>
            {error && <p id="footer-email-err" role="alert" className="mt-2 text-xs text-danger">{error}</p>}
          </form>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {footerNav.map((col) => (
            <div key={col.title}>
              <p className="eyebrow">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[13.5px] text-ink-300 transition-colors hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container flex flex-col gap-3 border-t border-white/[.06] py-6 text-[12px] text-ink-500 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Alder — an independent design & engineering showcase.</p>
        <p className="max-w-xl md:text-right">Demo brands, people, testimonials and results on this site are fictional and illustrative. They are not real customers or verified outcomes.</p>
      </div>
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.22em] text-center font-display text-[22vw] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.06)]">ALDER</p>
      </div>
    </footer>
  );
}
