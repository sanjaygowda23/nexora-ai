import { lazy, Suspense } from "react";
import { createHashRouter, createRoutesFromElements, Navigate, Outlet, Route, RouterProvider } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { AppStoreProvider } from "@/store/AppStore";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { RequireSession } from "@/components/layout/RequireSession";
import { PageLoader } from "@/components/layout/PageLoader";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";

/* Route-level code splitting: marketing visitors never download React Flow or Recharts. */
const Home = lazy(() => import("@/pages/marketing/Home"));
const Solutions = lazy(() => import("@/pages/marketing/Solutions"));
const Platform = lazy(() => import("@/pages/marketing/Platform"));
const Industries = lazy(() => import("@/pages/marketing/Industries"));
const CaseStudies = lazy(() => import("@/pages/marketing/CaseStudies"));
const CaseStudyDetail = lazy(() => import("@/pages/marketing/CaseStudyDetail"));
const Contact = lazy(() => import("@/pages/marketing/Contact"));
const NotFound = lazy(() => import("@/pages/marketing/NotFound"));

const SignIn = lazy(() => import("@/pages/app/SignIn"));
const Dashboard = lazy(() => import("@/pages/app/Dashboard"));
const Agents = lazy(() => import("@/pages/app/Agents"));
const AgentDetail = lazy(() => import("@/pages/app/AgentDetail"));
const Workflows = lazy(() => import("@/pages/app/Workflows"));
const WorkflowBuilder = lazy(() => import("@/pages/app/WorkflowBuilder"));
const Analytics = lazy(() => import("@/pages/app/Analytics"));
const ActivityLogs = lazy(() => import("@/pages/app/ActivityLogs"));
const Settings = lazy(() => import("@/pages/app/Settings"));

/** Root: shared concerns that must live inside the router. */
function Root() {
  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

/**
 * A hash-based *data* router: deep links work on any static host (GitHub Pages, artifact hosting)
 * without server rewrites, and data-router APIs like useBlocker (unsaved-changes guard) are available.
 * Swap for createBrowserRouter on Vercel/Netlify with an SPA fallback.
 */
const router = createHashRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route element={<MarketingLayout />}>
        <Route index element={<Home />} />
        <Route path="solutions" element={<Solutions />} />
        <Route path="platform" element={<Platform />} />
        <Route path="industries" element={<Industries />} />
        <Route path="case-studies" element={<CaseStudies />} />
        <Route path="case-studies/:id" element={<CaseStudyDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="app/sign-in" element={<SignIn />} />
      <Route path="app" element={<RequireSession><AppLayout /></RequireSession>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="agents" element={<Agents />} />
        <Route path="agents/:id" element={<AgentDetail />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="workflows/:id" element={<WorkflowBuilder />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="activity" element={<ActivityLogs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Route>
  ),
  { future: { v7_relativeSplatPath: true, v7_fetcherPersist: true, v7_normalizeFormMethod: true, v7_partialHydration: true, v7_skipActionErrorRevalidation: true } }
);

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <AppStoreProvider>
      <TooltipProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
        <Toaster theme="dark" position="bottom-right" toastOptions={{ className: "!font-sans !rounded-xl !border-border" }} />
      </TooltipProvider>
    </AppStoreProvider>
    </MotionConfig>
  );
}
