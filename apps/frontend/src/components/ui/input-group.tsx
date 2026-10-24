import * as React from "react";
import { cn } from "@/lib/utils";

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex items-center w-full rounded-md border border-input bg-transparent text-sm ring-offset-background",
      className
    )}
    {...props}
  />
));
InputGroup.displayName = "InputGroup";

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: "inline-start" | "inline-end" }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-center shrink-0 text-muted-foreground",
      className
    )}
    {...props}
  />
));
InputGroupAddon.displayName = "InputGroupAddon";

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-none outline-none transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
InputGroupInput.displayName = "InputGroupInput";

export { InputGroup, InputGroupAddon, InputGroupInput };
