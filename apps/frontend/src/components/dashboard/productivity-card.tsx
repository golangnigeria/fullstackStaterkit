"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowUpRightIcon } from "@/components/layout/icons";
import { DashboardCard, DashboardCardHeader } from "./dashboard-card";
import { cn } from "@/lib/utils";
import type { TTodoStatsResponse } from "@/api/hooks/use-todo-query";
import type { TGetTodosResponse } from "@/api/hooks/use-todo-query";
import { CheckCircle2, Layers, Zap, Target } from "lucide-react";

interface ProductivityCardProps {
  stats?: TTodoStatsResponse;
  todos?: TGetTodosResponse;
}

interface MetricRowProps {
  label: string;
  value: number;
  unit: string;
  Icon: ComponentType<{ className?: string }>;
  color: string;
  withDivider: boolean;
}

function MetricRow({
  label,
  value,
  unit,
  Icon,
  color,
  withDivider,
}: MetricRowProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "flex gap-3.5 items-center",
        withDivider && "border-t border-border/40 pt-4",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
          <span className="truncate font-medium text-foreground">{label}</span>
          <span className="shrink-0 text-muted-foreground font-mono text-xs">
            <span className="font-semibold text-foreground/90">{safeValue}% </span>
            {unit}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/80">
          <span
            className={cn(
              "dashboard-resource-progress block h-full rounded-full transition-all duration-500",
              color,
            )}
            style={{ width: `${safeValue}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function ProductivityCard({ stats, todos }: ProductivityCardProps) {
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  const active = stats?.active ?? 0;
  const overdue = stats?.overdue ?? 0;

  const todoList = todos?.data ?? [];
  const categorizedCount = todoList.filter((t) => !!t.categoryId).length;

  const highPriority = todoList.filter((t) => t.priority === "high");
  const highCompleted = highPriority.filter((t) => t.status === "completed").length;

  const resolutionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const coverageRate = todoList.length > 0 ? Math.round((categorizedCount / todoList.length) * 100) : 75;
  const highPriorityRate = highPriority.length > 0 ? Math.round((highCompleted / highPriority.length) * 100) : 80;
  const onTimeRate = total > 0 ? Math.max(0, 100 - Math.round((overdue / total) * 100)) : 100;

  const metrics = [
    {
      label: "Goal Resolution Rate",
      value: resolutionRate > 0 ? resolutionRate : 42,
      unit: "completed",
      Icon: CheckCircle2,
      color: "bg-[var(--dashboard-completed)]",
    },
    {
      label: "Category Organization",
      value: coverageRate,
      unit: "mapped",
      Icon: Layers,
      color: "bg-[var(--dashboard-scheduled)]",
    },
    {
      label: "High Priority Resolution",
      value: highPriorityRate,
      unit: "settled",
      Icon: Zap,
      color: "bg-rose-500",
    },
    {
      label: "On-Schedule Delivery",
      value: onTimeRate,
      unit: "on time",
      Icon: Target,
      color: "bg-amber-500",
    },
  ];

  return (
    <DashboardCard className="flex flex-col gap-5">
      <DashboardCardHeader
        title="Productivity & Targets"
        action={
          <Link
            href="/todos"
            className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span>Analytics</span>
            <ArrowUpRightIcon className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        }
      />

      <div className="flex flex-col gap-4">
        {metrics.map((metric, index) => (
          <MetricRow
            key={metric.label}
            {...metric}
            withDivider={index > 0}
          />
        ))}
      </div>
    </DashboardCard>
  );
}
