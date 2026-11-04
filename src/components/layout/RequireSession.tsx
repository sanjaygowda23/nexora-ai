import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "@/store/AppStore";

/** Protected-style demo route: no real auth, but the app is gated behind a demo session. */
export function RequireSession({ children }: { children: React.ReactNode }) {
  const { session } = useAppStore();
  const location = useLocation();
  if (!session.signedIn) return <Navigate to="/app/sign-in" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
