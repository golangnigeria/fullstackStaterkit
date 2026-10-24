"use client";

import { useState } from "react";
import { format, isPast, parseISO } from "date-fns";
import {
  CheckCircle2,
  CircleDashed,
  SlidersHorizontal,
  Timer,
  Clock,
  Layers,
  Archive,
  Download,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardCard, DashboardCardHeader } from "./dashboard-card";
import { cn } from "@/lib/utils";
import type { TGetTodosResponse } from "@/api/hooks/use-todo-query";
import type { ZPopulatedTodo } from "@tutorlinkng/zod";
import type { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type PopulatedTodo = z.infer<typeof ZPopulatedTodo>;

type TodoStatusFilter = "all" | "active" | "completed" | "draft" | "archived";

interface ActiveTasksTableProps {
  todos?: TGetTodosResponse;
  isLoading?: boolean;
  onSelectTodo: (todo: PopulatedTodo) => void;
}

const statusFilterOptions: { value: TodoStatusFilter; label: string; icon: typeof Timer }[] = [
  { value: "all", label: "All Tasks", icon: SlidersHorizontal },
  { value: "active", label: "Active", icon: Timer },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
  { value: "draft", label: "Drafts", icon: CircleDashed },
  { value: "archived", label: "Archived", icon: Archive },
];

const priorityBadges: Record<string, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
  },
  medium: {
    label: "Med",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  },
  low: {
    label: "Low",
    className: "bg-muted text-muted-foreground border border-border/50",
  },
};

export function ActiveTasksTable({
  todos,
  isLoading,
  onSelectTodo,
}: ActiveTasksTableProps) {
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>("all");

  const allTodos = (todos?.data ?? []) as PopulatedTodo[];

  const filteredTodos = allTodos.filter((todo) => {
    if (statusFilter === "all") return true;
    return todo.status === statusFilter;
  });

  const handleExport = () => {
    if (!filteredTodos.length) {
      toast.info("No tasks to export in the current view");
      return;
    }

    const csvRows = [
      ["Title", "Status", "Priority", "Due Date", "Category"],
      ...filteredTodos.map((t) => [
        `"${t.title.replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        t.dueDate ? format(new Date(t.dueDate), "yyyy-MM-dd") : "No due date",
        `"${t.category?.name || "Uncategorized"}"`,
      ]),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tutorlink-tasks-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tasks exported to CSV");
  };

  return (
    <DashboardCard className="flex flex-col gap-4 px-0 pb-0">
      <DashboardCardHeader
        className="px-4"
        title={
          <div className="flex items-center gap-2">
            <span>Active & Upcoming Tasks</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
              {filteredTodos.length}
            </span>
          </div>
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="h-8 gap-1.5 px-2.5 text-xs font-medium"
            >
              <Download className="size-3.5" />
              Export
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "h-8 gap-1.5 px-2.5 text-xs font-medium cursor-pointer",
                })}
              >
                <SlidersHorizontal className="size-3.5" />
                Filter
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val as TodoStatusFilter)}
                >
                  {statusFilterOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                        className={cn(
                          "text-xs gap-2 cursor-pointer",
                          statusFilter === option.value && "font-semibold text-foreground"
                        )}
                      >
                        <Icon className="size-3.5 text-muted-foreground" />
                        {option.label}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-160 table-fixed text-left">
          <thead>
            <tr className="h-10 text-xs font-semibold text-muted-foreground/80 border-b border-border/40 uppercase tracking-wider bg-muted/20">
              <th className="w-[18%] px-4">Due Date</th>
              <th className="w-[36%] px-4">Task</th>
              <th className="w-[20%] px-4">Category</th>
              <th className="w-[12%] px-4">Priority</th>
              <th className="w-[14%] px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="h-14 border-t border-border/40">
                  <td className="px-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4"><Skeleton className="h-4 w-44" /></td>
                  <td className="px-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                </tr>
              ))
            ) : filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => {
                const dueDate = todo.dueDate ? parseISO(todo.dueDate) : null;
                const isOverdue = dueDate && isPast(dueDate) && todo.status !== "completed";

                return (
                  <tr
                    key={todo.id}
                    onClick={() => onSelectTodo(todo)}
                    className="h-14 border-t border-border/40 transition-colors hover:bg-foreground/5 cursor-pointer group"
                  >
                    <td className="px-4 text-xs font-medium text-foreground">
                      {dueDate ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className={cn("size-3.5 shrink-0", isOverdue ? "text-rose-500" : "text-muted-foreground")} />
                          <span className={cn(isOverdue && "text-rose-600 dark:text-rose-400 font-semibold")}>
                            {format(dueDate, "MMM dd, yyyy")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No deadline</span>
                      )}
                    </td>

                    <td className="px-4">
                      <div className="min-w-0 pr-2">
                        <p className="truncate text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {todo.title}
                        </p>
                        {todo.description ? (
                          <p className="truncate text-[11px] text-muted-foreground mt-0.5">
                            {todo.description}
                          </p>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-4">
                      {todo.category ? (
                        <div className="inline-flex items-center gap-1.5 max-w-full">
                          <span
                            className="size-2 rounded-full shrink-0 ring-1 ring-black/10"
                            style={{ backgroundColor: todo.category.color || "#3b82f6" }}
                          />
                          <span className="truncate text-xs font-medium text-foreground/80">
                            {todo.category.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </td>

                    <td className="px-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider",
                          priorityBadges[todo.priority]?.className ?? priorityBadges.low.className
                        )}
                      >
                        {priorityBadges[todo.priority]?.label ?? todo.priority}
                      </span>
                    </td>

                    <td className="px-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium leading-5",
                          todo.status === "active" &&
                            "bg-[color-mix(in_oklch,var(--dashboard-scheduled)_14%,transparent)] text-[var(--dashboard-scheduled)]",
                          todo.status === "completed" &&
                            "bg-[color-mix(in_oklch,var(--dashboard-completed)_14%,transparent)] text-[var(--dashboard-completed)]",
                          isOverdue &&
                            "bg-[color-mix(in_oklch,var(--dashboard-no-show)_14%,transparent)] text-[var(--dashboard-no-show)]",
                          todo.status === "draft" &&
                            "bg-muted text-muted-foreground",
                          todo.status === "archived" &&
                            "bg-muted/60 text-muted-foreground/70"
                        )}
                      >
                        {isOverdue ? "Overdue" : todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Layers className="size-6 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-foreground">No tasks match this filter</p>
                    <p className="text-xs text-muted-foreground">
                      Try selecting a different status filter or create a new task.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
