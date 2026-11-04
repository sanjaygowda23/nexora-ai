import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }: {
  icon?: LucideIcon; title: string; description?: string; action?: { label: string; onClick: () => void }; className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center", className)}>
      <div className="relative mb-4 grid h-12 w-12 place-items-center rounded-xl border bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>}
      {action && <Button variant="outline" size="sm" className="mt-5" onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, onRetry, className }: {
  title?: string; description?: string; onRetry?: () => void; className?: string;
}) {
  return (
    <div role="alert" className={cn("flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center", className)}>
      <AlertTriangle className="mb-3 h-6 w-6 text-destructive" />
      <p className="text-sm font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>}
      {onRetry && <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
