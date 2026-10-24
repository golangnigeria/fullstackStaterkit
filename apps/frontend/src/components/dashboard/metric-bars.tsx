import { cn } from "@/lib/utils";

export function MetricBars({
  lastSixDays,
  className,
}: {
  lastSixDays: readonly number[];
  className?: string;
}) {
  const maximum = Math.max(...lastSixDays, 1);

  return (
    <div className="flex h-7.5 w-10 shrink-0 items-end justify-between">
      {lastSixDays.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className={cn("w-1.25 rounded-t-xs transition-all duration-300", className)}
          style={{ height: `${Math.max(12, (value / maximum) * 100)}%` }}
        />
      ))}
    </div>
  );
}
