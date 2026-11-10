import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, BarChart3, Bell, Bot, ChevronsLeft, ExternalLink, LayoutDashboard, LogOut, Menu, Moon, Search, Settings, Sun, Workflow, X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { CommandPalette } from "@/components/app/CommandPalette";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn, timeAgo } from "@/lib/utils";
import { useAppStore } from "@/store/AppStore";

export const APP_NAV = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/agents", label: "Agents", icon: Bot },
  { to: "/app/workflows", label: "Workflows", icon: Workflow },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/activity", label: "Activity", icon: Activity },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

/** Applies the user's appearance preference to <html>. */
function useAppTheme() {
  const { settings } = useAppStore();
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const t = settings.appearance.theme;
  const dark = t === "dark" || (t === "system" && prefersDark);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.add("dark");
  }, [dark]);
  return dark;
}

export function AppLayout() {
  const dark = useAppTheme();
  const { settings, setSettings, signOut, logs } = useAppStore();
  const [collapsed, setCollapsed] = useLocalStorage("alder:v1:sidebar-collapsed", false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const location = useLocation();
  const navigate = useNavigate();
  const compact = settings.appearance.density === "compact";

  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen((o) => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => setSettings({ ...settings, appearance: { ...settings.appearance, theme: dark ? "light" : "dark" } });
  const alerts = logs.filter((l) => l.status === "failed" || l.status === "warning").slice(0, 5);
  const isBuilder = /^\/app\/workflows\/.+/.test(location.pathname);
  /** The builder needs canvas space: show the icon rail there without changing the saved preference. */
  const mini = collapsed || isBuilder;

  const sidebar = (mini: boolean) => (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-14 items-center border-b px-4", mini && "justify-center px-0")}>
        <Link to="/app/dashboard" aria-label="ALDER console home" className="text-foreground">
          {mini ? <LogoMark /> : <Logo className="[&_span]:text-foreground" />}
        </Link>
      </div>
      {!mini && (
        <button onClick={() => setCmdOpen(true)} className="mx-3 mt-3 flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:border-primary/40">
          <Search className="h-4 w-4" /> Search…
          <kbd className="ml-auto rounded border bg-muted px-1.5 font-mono text-[10px]">⌘K</kbd>
        </button>
      )}
      <nav className="mt-3 flex-1 space-y-0.5 px-3" aria-label="Console">
        {APP_NAV.map(({ to, label, icon: Icon }) => {
          const link = (
            <NavLink key={to} to={to}
              className={({ isActive }) => cn(
                "group relative flex items-center gap-3 rounded-lg px-3 text-[13.5px] font-medium transition-colors",
                compact ? "py-1.5" : "py-2",
                mini && "justify-center px-0",
                isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="nav-active" className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary" />}
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} />
                  {!mini && label}
                </>
              )}
            </NavLink>
          );
          return mini ? <Tooltip key={to} content={label} side="right">{link}</Tooltip> : link;
        })}
      </nav>
      <div className="space-y-2 border-t p-3">
        {!mini && (
          <div className="rounded-lg border bg-muted p-3">
            <p className="text-[12.5px] font-medium">Demo workspace</p>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">Data is simulated and saved in this browser.</p>
          </div>
        )}
        <Link to="/" className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] text-muted-foreground hover:bg-accent hover:text-foreground", mini && "justify-center px-0")}>
          <ExternalLink className="h-4 w-4" />{!mini && "Back to website"}
        </Link>
      </div>
    </div>
  );

  return (
    <div className={cn("min-h-dvh bg-background text-foreground", compact && "text-[13.5px]")}>
      {/* Desktop sidebar */}
      <aside className={cn("fixed inset-y-0 left-0 z-30 hidden border-r bg-surface transition-[width] duration-300 ease-out lg:block", mini ? "w-[68px]" : "w-60")}>
        {sidebar(mini)}
        {!isBuilder && <button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[68px] grid h-6 w-6 place-items-center rounded-full border bg-surface text-muted-foreground shadow-sm transition hover:text-foreground">
          <ChevronsLeft className={cn("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
        </button>}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && !isDesktop && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside role="dialog" aria-modal="true" aria-label="Navigation" className="fixed inset-y-0 left-0 z-50 w-72 border-r bg-surface"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 380, damping: 38 }}>
              {sidebar(false)}
              <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3.5 rounded-md p-1.5 text-muted-foreground hover:bg-accent" aria-label="Close navigation"><X className="h-4 w-4" /></button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={cn("transition-[padding] duration-300 ease-out", mini ? "lg:pl-[68px]" : "lg:pl-60")}>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <button className="rounded-md p-1.5 hover:bg-accent lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
          <div className="flex min-w-0 items-center gap-2 text-[13px]">
            <span className="hidden truncate text-muted-foreground sm:inline">{settings.workspace.name}</span>
            <span className="hidden text-muted-foreground/50 sm:inline">/</span>
            <span className="truncate font-medium capitalize">{location.pathname.split("/")[2] ?? "dashboard"}</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setCmdOpen(true)} aria-label="Search" className="lg:hidden"><Search className="h-[18px] w-[18px]" /></Button>
            <Tooltip content={dark ? "Light mode" : "Dark mode"}>
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">{dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}</Button>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={`Notifications, ${alerts.length} unread`} className="relative">
                  <Bell className="h-[18px] w-[18px]" />
                  {alerts.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Needs attention</DropdownMenuLabel>
                {alerts.map((a) => (
                  <DropdownMenuItem key={a.id} onSelect={() => navigate(`/app/activity?q=${encodeURIComponent(a.agent)}`)} className="items-start">
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", a.status === "failed" ? "bg-destructive" : "bg-warning")} />
                    <span className="min-w-0">
                      <span className="block truncate text-foreground">{a.action}</span>
                      <span className="block text-[11.5px] text-muted-foreground">{a.agent} · {timeAgo(a.timestamp)}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/app/activity?status=failed")}>View all failures</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-brand text-[12px] font-semibold text-white ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="Account menu">
                  {settings.profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <div className="px-2.5 py-2">
                  <p className="text-[13px] font-medium">{settings.profile.name}</p>
                  <p className="truncate text-[12px] text-muted-foreground">{settings.profile.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate("/app/settings")}><Settings />Settings</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate("/")}><ExternalLink />Website</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onSelect={() => { signOut(); toast("Signed out of the demo workspace"); navigate("/app/sign-in"); }}><LogOut />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main id="main" className={cn(isBuilder ? "" : "mx-auto max-w-[1400px] px-4 py-6 md:px-6 md:py-8")}>
          <Outlet />
        </main>
      </div>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  );
}
