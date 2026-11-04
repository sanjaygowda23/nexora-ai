import { LogoMark } from "@/components/brand/Logo";

export function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-label="Loading page">
      <div className="relative">
        <span className="absolute inset-0 rounded-lg bg-electric/40 animate-pulse-ring" aria-hidden />
        <LogoMark className="relative h-9 w-9" />
      </div>
    </div>
  );
}
