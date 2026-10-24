"use client";

import { useState } from "react";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import {
  CalendarDotsIcon,
  CaretDownIcon,
  FileArrowUpIcon,
} from "@/components/layout/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/auth-client";
import { useGetTodoStats, useGetAllTodos } from "@/api/hooks/use-todo-query";
import { useGetAllCategories } from "@/api/hooks/use-category-query";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { TaskVolumeChart } from "@/components/dashboard/task-volume-chart";
import { CategoryLoadCard } from "@/components/dashboard/category-load-card";
import { ActiveTasksTable } from "@/components/dashboard/active-tasks-table";
import { ProductivityCard } from "@/components/dashboard/productivity-card";
import { CategoryVelocityCard } from "@/components/dashboard/category-velocity-card";
import { TaskDetailSheet } from "@/components/dashboard/task-detail-sheet";
import { TodoCreateForm } from "@/components/todos/todo-create-form";
import type { ZPopulatedTodo } from "@tutorlinkng/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PopulatedTodo = z.infer<typeof ZPopulatedTodo>;

const timelineRanges = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "This Month" },
  { value: "90d", label: "This Quarter" },
  { value: "all", label: "All Time" },
] as const;

type TimelineRange = (typeof timelineRanges)[number]["value"];

function getGreeting(user?: { email?: string; name?: string } | null) {
  const hour = new Date().getHours();
  let displayName = "Tutor";
  if (user?.name) {
    displayName = user.name.split(" ")[0];
  } else if (user?.email) {
    displayName = user.email.split("@")[0];
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  }
  if (hour < 12) return `Good Morning, ${displayName}`;
  if (hour < 18) return `Good Afternoon, ${displayName}`;
  return `Good Evening, ${displayName}`;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [selectedRange, setSelectedRange] = useState<TimelineRange>("30d");
  const [selectedTodo, setSelectedTodo] = useState<PopulatedTodo | null>(null);

  const { data: stats, isLoading: statsLoading } = useGetTodoStats();
  const { data: todos, isLoading: todosLoading } = useGetAllTodos({
    query: { limit: 50, sort: "created_at", order: "desc" },
  });
  const { data: categories, isLoading: categoriesLoading } = useGetAllCategories({
    query: { limit: 20 },
  });

  const selectedRangeMeta = timelineRanges.find((r) => r.value === selectedRange);

  const handleGlobalExport = () => {
    if (!todos?.data?.length) {
      toast.info("No task data available to export yet");
      return;
    }

    const csvContent = [
      ["ID", "Title", "Status", "Priority", "Due Date", "Category", "Created At"],
      ...todos.data.map((t) => [
        `"${t.id}"`,
        `"${t.title.replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        t.dueDate || "None",
        `"${t.category?.name || "Uncategorized"}"`,
        t.createdAt,
      ]),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tutorlink-workspace-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Workspace report exported to CSV");
  };

  const currentDateLabel = format(new Date(), "EEEE, MMM dd, yyyy");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Medesk Inspired Header Section */}
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-2">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
            {getGreeting(session?.user)}
          </h1>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground font-medium">
            <CalendarDotsIcon className="size-4 shrink-0 text-muted-foreground/80" />
            <span>{currentDateLabel}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            onClick={handleGlobalExport}
            className="h-9 rounded-lg px-3.5 text-xs font-semibold shadow-2xs hover:bg-muted"
          >
            <FileArrowUpIcon className="size-4 mr-1.5" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({
                variant: "secondary",
                className: "h-9 rounded-lg px-3.5 text-xs font-semibold shadow-2xs cursor-pointer gap-1.5",
              })}
            >
              <CalendarDotsIcon className="size-4" />
              <span>{selectedRangeMeta?.label}</span>
              <CaretDownIcon className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup
                value={selectedRange}
                onValueChange={(val) => setSelectedRange(val as TimelineRange)}
              >
                {timelineRanges.map((range) => (
                  <DropdownMenuRadioItem
                    key={range.value}
                    value={range.value}
                    className={cn(
                      "text-xs cursor-pointer",
                      selectedRange === range.value && "font-semibold text-foreground"
                    )}
                  >
                    {range.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <TodoCreateForm>
            <Button
              type="button"
              className="h-9 rounded-lg px-4 text-xs font-semibold shadow-xs shadow-primary/20 cursor-pointer"
            >
              <PlusIcon className="size-4 mr-1.5" />
              Add Task
            </Button>
          </TodoCreateForm>
        </div>
      </section>

      {/* 1. Top 4 Metric Cards with Sparklines */}
      <MetricCards stats={stats} isLoading={statsLoading} />

      {/* 2. Middle Grid: Task Volume & Category Load */}
      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,25rem)]">
        <div className="min-w-0">
          <TaskVolumeChart stats={stats} timelineRange={selectedRange} />
        </div>
        <CategoryLoadCard
          categories={categories}
          todos={todos}
          isLoading={categoriesLoading}
        />
      </section>

      {/* 3. Lower Grid: Active Tasks Table & Sidebar Metrics */}
      <section className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,25rem)]">
        <ActiveTasksTable
          todos={todos}
          isLoading={todosLoading}
          onSelectTodo={(todo) => setSelectedTodo(todo)}
        />
        <div className="grid min-w-0 gap-3 self-start">
          <CategoryVelocityCard categories={categories} todos={todos} />
          <ProductivityCard stats={stats} todos={todos} />
        </div>
      </section>

      {/* 4. Slide-Out Task Detail Drawer */}
      <TaskDetailSheet
        todo={selectedTodo}
        open={selectedTodo !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedTodo(null);
        }}
      />
    </div>
  );
}
