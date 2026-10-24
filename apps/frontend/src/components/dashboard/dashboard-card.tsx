import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DashboardCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-xl bg-card p-4 text-card-foreground border border-border/40 shadow-xs",
        className
      )}
    >
      {children}
    </section>
  );
}

export function DashboardCardHeader({
  title,
  action,
  className,
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="text-base sm:text-lg leading-6 font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {action ? (
        <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-foreground/80">
          {action}
        </div>
      ) : null}
    </div>
  );
}
