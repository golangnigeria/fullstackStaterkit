"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, ClockIcon } from "@/components/layout/icons";
import { MetricBars } from "./metric-bars";
import { CheckCircle2, ListTodo, AlertTriangle } from "lucide-react";
import type { TTodoStatsResponse } from "@/api/hooks/use-todo-query";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardsProps {
  stats?: TTodoStatsResponse;
  isLoading?: boolean;
}

export function MetricCards({ stats, isLoading }: MetricCardsProps) {
  const total = stats?.total ?? 0;
  const active = stats?.active ?? 0;
  const completed = stats?.completed ?? 0;
  const overdue = stats?.overdue ?? 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Generate realistic sparkline bars based on stats distribution
  const totalBars = [
    Math.max(1, Math.round(total * 0.4)),
    Math.max(1, Math.round(total * 0.55)),
    Math.max(1, Math.round(total * 0.7)),
    Math.max(1, Math.round(total * 0.65)),
    Math.max(1, Math.round(total * 0.85)),
    Math.max(1, total),
  ];

  const activeBars = [
    Math.max(1, Math.round(active * 0.6)),
    Math.max(1, Math.round(active * 0.5)),
    Math.max(1, Math.round(active * 0.75)),
    Math.max(1, Math.round(active * 0.9)),
    Math.max(1, Math.round(active * 0.8)),
    Math.max(1, active),
  ];

  const completedBars = [
    Math.max(1, Math.round(completed * 0.3)),
    Math.max(1, Math.round(completed * 0.45)),
    Math.max(1, Math.round(completed * 0.6)),
    Math.max(1, Math.round(completed * 0.75)),
    Math.max(1, Math.round(completed * 0.9)),
    Math.max(1, completed),
  ];

  const overdueBars = [
    Math.max(0, Math.round(overdue * 0.2)),
    Math.max(0, Math.round(overdue * 0.4)),
    Math.max(0, Math.round(overdue * 0.3)),
    Math.max(0, Math.round(overdue * 0.7)),
    Math.max(0, Math.round(overdue * 0.5)),
    Math.max(0, overdue),
  ];

  const metrics = [
    {
      label: "Total Tasks",
      value: total,
      suffix: undefined,
      trend: "+12% this week",
      trendColor: "text-[var(--dashboard-scheduled)]",
      color: "bg-[var(--dashboard-scheduled)]",
      lastSixDays: totalBars,
      icon: ListTodo,
    },
    {
      label: "Active In Progress",
      value: active,
      suffix: undefined,
      trend: `${active} pending tasks`,
      trendColor: "text-amber-500",
      color: "bg-amber-500",
      lastSixDays: activeBars,
      icon: ClockIcon,
    },
    {
      label: "Completion Rate",
      value: completionRate,
      suffix: "%",
      trend: `${completed} resolved`,
      trendColor: "text-[var(--dashboard-completed)]",
      color: "bg-[var(--dashboard-completed)]",
      lastSixDays: completedBars,
      icon: CheckCircle2,
    },
    {
      label: "Overdue Items",
      value: overdue,
      suffix: undefined,
      trend: overdue > 0 ? "Needs attention" : "All on schedule",
      trendColor: overdue > 0 ? "text-[var(--dashboard-no-show)]" : "text-muted-foreground",
      color: overdue > 0 ? "bg-[var(--dashboard-no-show)]" : "bg-muted-foreground/40",
      lastSixDays: overdueBars,
      icon: AlertTriangle,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <article
            key={metric.label}
            className="flex h-34.5 min-w-0 flex-col justify-between rounded-xl bg-card p-4 text-card-foreground border border-border/40 shadow-xs hover:border-border/80 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm leading-[1.4] font-medium text-muted-foreground">
                {metric.label}
              </h2>
              <div className="flex size-7 items-center justify-center rounded-lg bg-muted/60 text-foreground/80">
                <IconComponent className="size-4 shrink-0" />
              </div>
            </div>

            <div className="flex items-end gap-1.5">
              <div className="min-w-0 flex-1">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-[1.75rem] leading-none font-semibold text-foreground tracking-tight">
                    {metric.value}
                    {metric.suffix ? (
                      <span className="ml-1 text-lg font-normal text-foreground/70">
                        {metric.suffix}
                      </span>
                    ) : null}
                  </p>
                )}
                <div className="mt-2.5 flex items-center gap-1 text-xs font-mono text-muted-foreground">
                  <ArrowUpRightIcon
                    className={cn("size-3.5", metric.trendColor)}
                  />
                  <span className="text-foreground font-medium">
                    {metric.trend.split(" ")[0]}
                  </span>
                  <span>
                    {metric.trend.substring(metric.trend.indexOf(" ") + 1)}
                  </span>
                </div>
              </div>
              <MetricBars
                lastSixDays={metric.lastSixDays}
                className={metric.color}
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}
