import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function MarketingLayout() {
  useEffect(() => { document.documentElement.classList.add("dark"); }, []);
  return (
    <div className="min-h-dvh bg-ink-950 text-white">
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}
        className="sr-only z-[60] rounded-md bg-white px-3 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
