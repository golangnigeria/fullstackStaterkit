"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRightIcon } from "@/components/layout/icons";
import { DashboardCard, DashboardCardHeader } from "./dashboard-card";
import { cn } from "@/lib/utils";
import type { TGetCategoriesResponse } from "@/api/hooks/use-category-query";
import type { TGetTodosResponse } from "@/api/hooks/use-todo-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers } from "lucide-react";

interface CategoryLoadCardProps {
  categories?: TGetCategoriesResponse;
  todos?: TGetTodosResponse;
  isLoading?: boolean;
}

const defaultCategoryColors = [
  "bg-[var(--dashboard-scheduled)]",
  "bg-[var(--dashboard-completed)]",
  "bg-[var(--dashboard-no-show)]",
  "bg-[var(--dashboard-secondary)]",
  "bg-amber-500",
  "bg-indigo-500",
];

export function CategoryLoadCard({
  categories,
  todos,
  isLoading,
}: CategoryLoadCardProps) {
  const categoryList = categories?.data ?? [];
  const todoList = todos?.data ?? [];

  // Calculate task counts per category
  const categoryCounts = categoryList.map((cat, index) => {
    const count = todoList.filter((t) => t.categoryId === cat.id).length;
    return {
      id: cat.id,
      name: cat.name,
      color: cat.color || defaultCategoryColors[index % defaultCategoryColors.length],
      count,
    };
  });

  const totalCategorized = categoryCounts.reduce(
    (sum, c) => sum + (c.count > 0 ? c.count : 1), // ensure at least minimal slice for presentation
    0
  );

  // If no categories yet, provide a clean friendly state
  const hasCategories = categoryList.length > 0;

  return (
    <DashboardCard className="flex flex-col gap-5">
      <DashboardCardHeader
        title="Category Distribution"
        action={
          <Link
            href="/categories"
            className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span>Manage</span>
            <ArrowUpRightIcon className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      ) : hasCategories ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground font-medium">Categorized Tasks</span>
              <span className="font-semibold text-foreground">
                {todoList.filter((t) => !!t.categoryId).length} of {todoList.length}
              </span>
            </div>

            {/* Segmented multi-color bar */}
            <div className="flex h-5 items-start gap-1 overflow-hidden rounded-md bg-muted/30 p-0.5">
              {categoryCounts.map((cat, index) => {
                const effectiveCount = cat.count > 0 ? cat.count : 1;
                const percent = Math.round((effectiveCount / totalCategorized) * 100);
                return (
                  <span
                    key={cat.id}
                    className="dashboard-load-segment h-full min-w-3 shrink-0 rounded-xs transition-all"
                    style={
                      {
                        backgroundColor: cat.color.startsWith("#") ? cat.color : undefined,
                        "--segment-width": `${percent}%`,
                        animationDelay: `${index * 80}ms`,
                      } as CSSProperties
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* Breakdown Rows with Dotted Leaders */}
          <div className="flex flex-col gap-4">
            {categoryCounts.slice(0, 5).map((cat) => {
              const effectiveCount = cat.count > 0 ? cat.count : 1;
              const percent = Math.round((effectiveCount / totalCategorized) * 100);
              return (
                <div
                  key={cat.id}
                  className="flex min-w-0 items-center gap-3 text-xs sm:text-sm"
                >
                  <div className="flex min-w-0 shrink-0 items-center gap-2 max-w-[50%]">
                    <span
                      className="size-3.5 rounded-xs shrink-0 shadow-2xs"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate font-medium text-foreground/85">
                      {cat.name}
                    </span>
                  </div>
                  <span className="min-w-0 flex-1 border-t border-dashed border-border/80" />
                  <div className="flex shrink-0 items-center gap-2 font-mono text-xs">
                    <span className="w-6 text-right font-semibold text-foreground/90">
                      {cat.count}
                    </span>
                    <span className="w-10 text-right text-muted-foreground font-medium">
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed rounded-lg p-4">
          <Layers className="size-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm font-semibold text-foreground">No Categories Yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Create categories like Math, English, or Science to track subject load distribution.
          </p>
          <Link
            href="/categories"
            className="mt-3 text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            Create Category
            <ArrowUpRightIcon className="size-3.5" />
          </Link>
        </div>
      )}
    </DashboardCard>
  );
}
