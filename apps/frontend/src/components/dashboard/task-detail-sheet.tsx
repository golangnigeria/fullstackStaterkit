"use client";

import { useState } from "react";
import { format, parseISO, isPast } from "date-fns";
import {
  X,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Trash2,
  ExternalLink,
  Layers,
  Paperclip,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useUpdateTodo, useDeleteTodo } from "@/api/hooks/use-todo-query";
import type { ZPopulatedTodo } from "@tutorlinkng/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PopulatedTodo = z.infer<typeof ZPopulatedTodo>;

interface TaskDetailSheetProps {
  todo: PopulatedTodo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailSheet({
  todo,
  open,
  onOpenChange,
}: TaskDetailSheetProps) {
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!todo) return null;

  const dueDate = todo.dueDate ? parseISO(todo.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && todo.status !== "completed";
  const isCompleted = todo.status === "completed";

  const handleToggleComplete = async () => {
    const nextStatus = isCompleted ? "active" : "completed";
    try {
      await updateTodoMutation.mutateAsync({
        todoId: todo.id,
        body: {
          title: todo.title,
          status: nextStatus,
        },
      });
      toast.success(
        nextStatus === "completed" ? "Task marked as completed!" : "Task reopened"
      );
    } catch {
      // error handled in hook
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setIsDeleting(true);
    try {
      await deleteTodoMutation.mutateAsync({ todoId: todo.id });
      toast.success("Task deleted");
      onOpenChange(false);
    } catch {
      // error handled in hook
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full! max-w-full! overflow-hidden bg-transparent sm:p-3 shadow-2xl sm:w-130! sm:max-w-130! border-none"
      >
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background sm:rounded-2xl border border-border shadow-xl">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border/40">
            <SheetTitle className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Task Overview
            </SheetTitle>

            <SheetClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </header>

          {/* Body Content */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 no-scrollbar">
            <SheetDescription className="sr-only">
              Details and actions for {todo.title}
            </SheetDescription>

            <div className="flex flex-col gap-6">
              {/* Category & Status pills */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {todo.category ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted/60 border border-border/50">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: todo.category.color || "#3b82f6" }}
                    />
                    <span>{todo.category.name}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Uncategorized</span>
                )}

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider",
                      todo.priority === "high" && "bg-rose-500/10 text-rose-600 border border-rose-500/20",
                      todo.priority === "medium" && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
                      todo.priority === "low" && "bg-muted text-muted-foreground border border-border/50"
                    )}
                  >
                    {todo.priority} Priority
                  </span>

                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      isCompleted && "bg-[color-mix(in_oklch,var(--dashboard-completed)_14%,transparent)] text-[var(--dashboard-completed)]",
                      !isCompleted && isOverdue && "bg-[color-mix(in_oklch,var(--dashboard-no-show)_14%,transparent)] text-[var(--dashboard-no-show)]",
                      !isCompleted && !isOverdue && "bg-[color-mix(in_oklch,var(--dashboard-scheduled)_14%,transparent)] text-[var(--dashboard-scheduled)]"
                    )}
                  >
                    {isCompleted ? "Completed" : isOverdue ? "Overdue" : "In Progress"}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground leading-snug">
                  {todo.title}
                </h3>
                {todo.description ? (
                  <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {todo.description}
                  </p>
                ) : (
                  <p className="mt-2 text-xs italic text-muted-foreground/60">
                    No additional description provided.
                  </p>
                )}
              </div>

              {/* Due Date Card */}
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex size-10 items-center justify-center rounded-xl",
                    isOverdue ? "bg-rose-500/10 text-rose-600" : "bg-muted text-foreground"
                  )}>
                    {isOverdue ? <AlertCircle className="size-5" /> : <Calendar className="size-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Due Date</p>
                    <p className={cn("text-sm font-semibold mt-0.5", isOverdue && "text-rose-600 dark:text-rose-400")}>
                      {dueDate ? format(dueDate, "EEEE, MMMM dd, yyyy") : "No due date set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata Information Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-card border border-border/40 p-3.5 flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Created</span>
                  <span className="text-xs font-semibold text-foreground">
                    {format(parseISO(todo.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>

                <div className="rounded-xl bg-card border border-border/40 p-3.5 flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Last Updated</span>
                  <span className="text-xs font-semibold text-foreground">
                    {format(parseISO(todo.updatedAt), "MMM dd, yyyy")}
                  </span>
                </div>

                <div className="rounded-xl bg-card border border-border/40 p-3.5 flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Paperclip className="size-3" />
                    Attachments
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {todo.attachments?.length ?? 0} files attached
                  </span>
                </div>

                <div className="rounded-xl bg-card border border-border/40 p-3.5 flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="size-3" />
                    Comments
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {todo.comments?.length ?? 0} notes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <footer className="p-4 border-t border-border/40 flex flex-col gap-2.5 bg-muted/10">
            <div className="flex items-center gap-2">
              <Button
                variant={isCompleted ? "outline" : "default"}
                onClick={handleToggleComplete}
                disabled={updateTodoMutation.isPending}
                className="flex-1 font-semibold gap-1.5"
              >
                <CheckCircle2 className="size-4" />
                {isCompleted ? "Reopen Task" : "Mark as Completed"}
              </Button>

              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="shrink-0"
                title="Delete task"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <Link href={`/todos?search=${encodeURIComponent(todo.title)}`} className="w-full">
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground gap-1.5">
                <ExternalLink className="size-3.5" />
                Open in Full Task Manager
              </Button>
            </Link>
          </footer>
        </div>
      </SheetContent>
    </Sheet>
  );
}
