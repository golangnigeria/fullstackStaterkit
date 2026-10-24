"use client";

import { useGetAllCategories } from "@/api/hooks/use-category-query";
import { useDebounce } from "@/api/hooks/use-debounce";
import {
  useGetAllTodos,
  type TGetTodosQuery,
} from "@/api/hooks/use-todo-query";
import { TodoCard } from "@/components/todos/todo-card";
import { TodoCreateForm } from "@/components/todos/todo-create-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, CheckSquare } from "lucide-react";
import { useState } from "react";

type TodoStatus = "draft" | "active" | "completed" | "archived";
type TodoPriority = "low" | "medium" | "high" | "all";

export default function TodosPage() {
  const [activeTab, setActiveTab] = useState<TodoStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<TodoPriority>("all");
  const [sortBy, setSortBy] = useState<TGetTodosQuery["sort"]>("updated_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: todos, isLoading } = useGetAllTodos({
    query: {
      page,
      limit: 20,
      search: debouncedSearch || undefined,
      status: activeTab === "all" ? undefined : activeTab,
      categoryId: selectedCategory === "all" ? undefined : selectedCategory,
      priority: selectedPriority === "all" ? undefined : selectedPriority,
      sort: sortBy,
      order: sortOrder,
    },
  });

  const { data: categories } = useGetAllCategories({
    query: { page: 1, limit: 100 },
  });

  const handleSelectTodo = (todoId: string, checked: boolean) => {
    if (checked) {
      setSelectedTodos((prev) => [...prev, todoId]);
    } else {
      setSelectedTodos((prev) => prev.filter((id) => id !== todoId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && todos?.data) {
      setSelectedTodos(todos.data.map((todo) => todo.id));
    } else {
      setSelectedTodos([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks & Todos</h1>
          <p className="text-muted-foreground text-sm">
            Organize, prioritize, and track your learning and tutoring action items.
          </p>
        </div>
        <TodoCreateForm>
          <Button className="font-medium shadow-xs">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </TodoCreateForm>
      </div>

      {/* Tabs and Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as TodoStatus | "all");
          setPage(1);
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="grid grid-cols-5 w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="completed">Done</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: category.color || "#3b82f6" }}
                      />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={selectedPriority}
              onValueChange={(value) => {
                setSelectedPriority(value as TodoPriority);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-32 h-9">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-");
                setSortBy(field as TGetTodosQuery["sort"]);
                setSortOrder(order as "asc" | "desc");
              }}
            >
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_at-desc">Recently Updated</SelectItem>
                <SelectItem value="created_at-desc">Newest First</SelectItem>
                <SelectItem value="due_date-asc">Due Date (Earliest)</SelectItem>
                <SelectItem value="priority-desc">Priority (High-Low)</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2 pt-2">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : todos?.data?.length ? (
              <>
                {/* Select All */}
                {todos.data.length > 1 && (
                  <Card className="bg-muted/40">
                    <CardContent className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={
                            selectedTodos.length === todos.data.length &&
                            todos.data.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-xs text-muted-foreground font-medium">
                          Select all {todos.data.length} tasks on this page
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {todos.data.map((todo) => (
                  <div key={todo.id} className="flex items-start gap-3">
                    <div className="pt-4">
                      <Checkbox
                        checked={selectedTodos.includes(todo.id)}
                        onCheckedChange={(checked) =>
                          handleSelectTodo(todo.id, checked as boolean)
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <TodoCard todo={todo} />
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {todos.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground">
                      Showing {(page - 1) * 20 + 1} to{" "}
                      {Math.min(page * 20, todos.total)} of {todos.total} tasks
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= todos.totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                  <h3 className="text-base font-semibold mb-1">No tasks found</h3>
                  <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
                    {searchQuery || selectedCategory !== "all" || selectedPriority !== "all"
                      ? "Try adjusting your search terms or clearing active filters."
                      : "Create your first task to begin organizing your work!"}
                  </p>
                  {searchQuery || selectedCategory !== "all" || selectedPriority !== "all" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedPriority("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <TodoCreateForm>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1.5" />
                        Create Task
                      </Button>
                    </TodoCreateForm>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
