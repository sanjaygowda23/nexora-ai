import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background,color,border,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[.98] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-white text-ink-950 hover:bg-ink-100 shadow-[0_1px_0_rgba(255,255,255,.4)_inset,0_8px_24px_-12px_rgba(76,125,255,.6)]",
        brand: "bg-electric text-white hover:bg-electric-600 shadow-[0_1px_0_rgba(255,255,255,.25)_inset,0_10px_30px_-12px_rgba(76,125,255,.8)]",
        secondary: "bg-white/[.06] text-foreground border border-white/10 hover:bg-white/[.1] hover:border-white/20",
        outline: "border border-border bg-transparent hover:bg-accent",
        ghost: "hover:bg-accent text-foreground",
        dark: "bg-ink-950 text-white hover:bg-ink-800",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "rounded-none px-0 underline-offset-4 hover:underline text-foreground",
      },
      size: {
        sm: "h-8 px-3.5 text-[13px]",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-[15px]",
        xl: "h-14 px-7 text-base",
        icon: "h-9 w-9 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** ALDER signature: a glowing signal dot that blooms into an arrow on hover. */
  signal?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, signal, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), signal && (size === "xl" ? "pr-16" : "pr-12"), className)}
        {...props}
      >
        {asChild && signal && React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<{ children?: React.ReactNode }>, {},
              <>{(children as React.ReactElement<{ children?: React.ReactNode }>).props.children}<SignalDot size={size} /></>)
          : asChild ? children : <>{children}{signal && <SignalDot size={size} />}</>}
      </Comp>
    );
  }
);
Button.displayName = "Button";

function SignalDot({ size }: { size?: ButtonProps["size"] }) {
  const big = size === "xl" || size === "lg";
  return (
    <span
      aria-hidden
      className={cn(
        "absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-signal shadow-[0_0_12px_rgba(62,230,210,.75)] transition-all duration-[450ms] ease-out",
        big ? "right-5 h-2.5 w-2.5 group-hover/btn:right-[6px] group-hover/btn:h-[40px] group-hover/btn:w-[40px]" : "right-4 h-2 w-2 group-hover/btn:right-[5px] group-hover/btn:h-[30px] group-hover/btn:w-[30px]",
        "group-hover/btn:shadow-none"
      )}
    >
      <svg viewBox="0 0 12 12" className={cn("-translate-x-1 opacity-0 transition-all delay-75 duration-300 group-hover/btn:translate-x-0 group-hover/btn:opacity-100", big ? "h-4 w-4" : "h-3 w-3")}>
        <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="#05070D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export { buttonVariants };
