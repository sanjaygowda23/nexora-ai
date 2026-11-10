import * as React from "react";
import { AlertCircle } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Label } from "./label";
import { cn } from "@/lib/utils";

/** Reusable field wrapper: label, hint, error, and correct aria wiring for its control. */
export function FormField({
  id, label, hint, error, required, className, children,
}: {
  id: string; label: string; hint?: string; error?: string; required?: boolean; className?: string;
  children: React.ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-brand-400" aria-hidden>*</span>}
      </Label>
      {withControlProps(children, { id, "aria-invalid": !!error, "aria-describedby": describedBy })}
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

type ControlProps = { id: string; "aria-invalid": boolean; "aria-describedby"?: string };

/**
 * Attach id/aria to the focusable control. A Radix Select root renders no DOM node,
 * so for selects the props go to its first child (the SelectTrigger).
 */
function withControlProps(child: React.ReactElement, props: ControlProps): React.ReactElement {
  if (child.type === SelectPrimitive.Root) {
    const kids = React.Children.toArray((child.props as { children?: React.ReactNode }).children) as React.ReactElement[];
    const [trigger, ...rest] = kids;
    return React.cloneElement(child, {}, React.cloneElement(trigger, props), ...rest);
  }
  return React.cloneElement(child, props);
}
