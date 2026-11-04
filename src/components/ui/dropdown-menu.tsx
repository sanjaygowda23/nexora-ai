import * as React from "react";
import * as DM from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const DropdownMenu = DM.Root;
export const DropdownMenuTrigger = DM.Trigger;

export const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof DM.Content>, React.ComponentPropsWithoutRef<typeof DM.Content>>(
  ({ className, sideOffset = 6, ...props }, ref) => (
    <DM.Portal>
      <DM.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[11rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1",
          className
        )}
        {...props}
      />
    </DM.Portal>
  )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof DM.Item>, React.ComponentPropsWithoutRef<typeof DM.Item> & { destructive?: boolean }>(
  ({ className, destructive, ...props }, ref) => (
    <DM.Item
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] outline-none transition-colors focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-muted-foreground",
        destructive && "text-destructive focus:bg-destructive/10 [&_svg]:text-destructive",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuCheckboxItem = React.forwardRef<React.ElementRef<typeof DM.CheckboxItem>, React.ComponentPropsWithoutRef<typeof DM.CheckboxItem>>(
  ({ className, children, ...props }, ref) => (
    <DM.CheckboxItem ref={ref} className={cn("relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-2.5 text-[13px] outline-none focus:bg-accent", className)} {...props}>
      <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
        <DM.ItemIndicator><Check className="h-3.5 w-3.5" /></DM.ItemIndicator>
      </span>
      {children}
    </DM.CheckboxItem>
  )
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

export const DropdownMenuLabel = ({ className, ...p }: React.ComponentPropsWithoutRef<typeof DM.Label>) => (
  <DM.Label className={cn("px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground", className)} {...p} />
);
export const DropdownMenuSeparator = ({ className, ...p }: React.ComponentPropsWithoutRef<typeof DM.Separator>) => (
  <DM.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...p} />
);
