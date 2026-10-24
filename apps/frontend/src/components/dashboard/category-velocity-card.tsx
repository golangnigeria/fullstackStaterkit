"use client";

import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/layout/icons";
import { DashboardCard, DashboardCardHeader } from "./dashboard-card";
import { cn } from "@/lib/utils";
import type { TGetCategoriesResponse } from "@/api/hooks/use-category-query";
import type { TGetTodosResponse } from "@/api/hooks/use-todo-query";
import { Layers } from "lucide-react";

interface CategoryVelocityCardProps {
  categories?: TGetCategoriesResponse;
  todos?: TGetTodosResponse;
}

export function CategoryVelocityCard({
  categories,
  todos,
}: CategoryVelocityCardProps) {
  const categoryList = categories?.data ?? [];
  const todoList = todos?.data ?? [];

  const categoryStats = categoryList.slice(0, 4).map((cat) => {
    const catTodos = todoList.filter((t) => t.categoryId === cat.id);
    const completedCount = catTodos.filter((t) => t.status === "completed").length;
    const progress = catTodos.length > 0 ? Math.round((completedCount / catTodos.length) * 100) : 0;

    return {
      id: cat.id,
      name: cat.name,
      description: cat.description || "General coursework & goals",
      color: cat.color || "#3b82f6",
      totalTasks: catTodos.length,
      progress,
    };
  });

  return (
    <DashboardCard className="flex flex-col gap-4 px-0 pb-0">
      <DashboardCardHeader
        className="px-4"
        title="Category Milestones"
        action={
          <Link
            href="/categories"
            className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span>View all</span>
            <ArrowUpRightIcon className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        }
      />

      <div className="flex flex-col">
        {categoryStats.length > 0 ? (
          categoryStats.map((item, index) => (
            <Link
              key={item.id}
              href={`/todos?categoryId=${item.id}`}
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-foreground/5",
                index > 0 && "border-t border-border/40"
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white font-bold text-sm shadow-xs"
                  style={{ backgroundColor: item.color }}
                >
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs sm:text-sm font-semibold text-foreground/90">
                    {item.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 text-right">
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-xs font-semibold text-foreground/90 font-mono">
                    {item.totalTasks} tasks
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {item.progress}% done
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <Layers className="size-6 text-muted-foreground/40 mb-1.5" />
            <p className="text-xs text-muted-foreground">
              No categories mapped to goals yet.
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
