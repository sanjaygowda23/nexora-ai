import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { mainNav, type NavGroup } from "@/data/site";
import { cn } from "@/lib/utils";
import { motionEase } from "@/styles/tokens";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const location = useLocation();
  const closeTimer = useRef<number>();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => { setOpen(null); setMobile(false); }, [location.pathname, location.hash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { document.body.style.overflow = mobile ? "hidden" : ""; }, [mobile]);

  const enter = (label: string) => { window.clearTimeout(closeTimer.current); setOpen(label); };
  const leave = () => { closeTimer.current = window.setTimeout(() => setOpen(null), 140); };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "absolute inset-0 border-b transition-all duration-300",
          scrolled || open ? "border-white/[.07] bg-ink-950/75 backdrop-blur-xl" : "border-transparent bg-transparent"
        )}
        aria-hidden
      />
      <nav className="container relative flex h-16 items-center justify-between" aria-label="Main">
        <Link to="/" className="relative z-10 rounded-md text-white" aria-label="NEXORA AI home">
          <Logo />
        </Link>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex" onMouseLeave={leave}>
          {mainNav.map((g) => (
            <li key={g.label} className="relative" onMouseEnter={() => (g.items ? enter(g.label) : setOpen(null))}>
              {g.items ? (
                <button
                  className={cn("flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] text-ink-300 transition-colors hover:text-white", open === g.label && "text-white")}
                  aria-expanded={open === g.label}
                  aria-controls={`menu-${g.label}`}
                  onClick={() => setOpen((o) => (o === g.label ? null : g.label))}
                >
                  {g.label}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", open === g.label && "rotate-180")} />
                </button>
              ) : (
                <NavLink to={g.to} className={({ isActive }) => cn("block rounded-full px-3.5 py-2 text-[13.5px] text-ink-300 transition-colors hover:text-white", isActive && "text-white")}>
                  {g.label}
                </NavLink>
              )}
              <AnimatePresence>
                {open === g.label && g.items && (
                  <MegaMenu group={g} onEnter={() => enter(g.label)} onLeave={leave} />
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <div className="relative z-10 flex items-center gap-2">
          <Link to="/app/dashboard" className="hidden rounded-full px-3 py-2 text-[13.5px] text-ink-300 transition-colors hover:text-white md:block">
            Live demo
          </Link>
          <Button asChild size="sm" variant="primary" signal className="hidden sm:inline-flex">
            <Link to="/contact">Book a consultation</Link>
          </Button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white lg:hidden"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            onClick={() => setMobile((m) => !m)}
          >
            {mobile ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>{mobile && <MobileMenu />}</AnimatePresence>
    </header>
  );
}

function MegaMenu({ group, onEnter, onLeave }: { group: NavGroup; onEnter: () => void; onLeave: () => void }) {
  const wide = !!group.feature;
  return (
    <motion.div
      id={`menu-${group.label}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.22, ease: motionEase }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn("absolute left-1/2 top-full -translate-x-1/2 pt-3", wide ? "w-[640px]" : "w-[420px]")}
    >
      <div className="glass grid overflow-hidden rounded-2xl bg-ink-900/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]" style={{ gridTemplateColumns: wide ? "1fr 210px" : "1fr" }}>
        <ul className={cn("grid gap-0.5 p-2", (group.items?.length ?? 0) > 4 ? "grid-cols-2" : "grid-cols-1")}>
          {group.items!.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/[.05] focus-visible:bg-white/[.05]">
                {item.icon && (
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[.03] text-ink-300 transition-colors group-hover:border-electric/40 group-hover:text-electric-400">
                    <item.icon className="h-4 w-4" />
                  </span>
                )}
                <span>
                  <span className="block text-[13.5px] font-medium text-white">{item.label}</span>
                  {item.description && <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-400">{item.description}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {group.feature && (
          <Link to={group.feature.to} className="group relative flex flex-col justify-end border-l border-white/[.06] bg-gradient-to-b from-electric/[.08] to-violet/[.08] p-5">
            <span className="eyebrow mb-auto text-signal">Featured</span>
            <span className="mt-8 text-[14px] font-medium text-white">{group.feature.title}</span>
            <span className="mt-1.5 text-[12.5px] leading-snug text-ink-400">{group.feature.body}</span>
            <ArrowUpRight className="mt-3 h-4 w-4 text-ink-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function MobileMenu() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-ink-950/98 backdrop-blur-xl lg:hidden"
    >
      <motion.ul
        className="container divide-y divide-white/[.06] py-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      >
        {mainNav.map((g) => (
          <motion.li key={g.label} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            {g.items ? (
              <>
                <button
                  className="flex w-full items-center justify-between py-4 text-left text-xl font-medium tracking-[-0.02em] text-white"
                  aria-expanded={expanded === g.label}
                  onClick={() => setExpanded((e) => (e === g.label ? null : g.label))}
                >
                  {g.label}
                  <ChevronDown className={cn("h-5 w-5 text-ink-400 transition-transform", expanded === g.label && "rotate-180")} />
                </button>
                <AnimatePresence initial={false}>
                  {expanded === g.label && (
                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <li><Link to={g.to} className="block py-2.5 text-[15px] text-electric-400">Overview</Link></li>
                      {g.items.map((i) => (
                        <li key={i.label}>
                          <Link to={i.to} className="flex items-center gap-3 py-2.5 text-[15px] text-ink-300">
                            {i.icon && <i.icon className="h-4 w-4 text-ink-500" />} {i.label}
                          </Link>
                        </li>
                      ))}
                      <li className="h-3" />
                    </motion.ul>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link to={g.to} className="block py-4 text-xl font-medium tracking-[-0.02em] text-white">{g.label}</Link>
            )}
          </motion.li>
        ))}
        <motion.li variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <Link to="/app/dashboard" className="block py-4 text-xl font-medium tracking-[-0.02em] text-white">Live demo</Link>
        </motion.li>
      </motion.ul>
      <div className="container pb-10">
        <Button asChild size="lg" signal className="w-full">
          <Link to="/contact">Book a consultation</Link>
        </Button>
      </div>
    </motion.div>
  );
}
