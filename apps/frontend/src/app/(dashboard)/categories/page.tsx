"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAllCategories,
  useDeleteCategory,
} from "@/api/hooks/use-category-query";
import { useDebounce } from "@/api/hooks/use-debounce";
import { CategoryCreateForm } from "@/components/categories/category-create-form";
import { CategoryEditForm } from "@/components/categories/category-edit-form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Folder,
} from "lucide-react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: categories, isLoading } = useGetAllCategories({
    query: {
      page,
      limit: 20,
      search: debouncedSearch || undefined,
      sort: "name",
      order: "asc",
    },
  });

  const deleteCategory = useDeleteCategory();

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string,
  ) => {
    try {
      await deleteCategory.mutateAsync({ categoryId });
      toast.success(`Category "${categoryName}" deleted successfully`);
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm">
            Organize courses, tutoring subjects, and study milestones.
          </p>
        </div>
        <CategoryCreateForm>
          <Button className="font-medium shadow-xs">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </CategoryCreateForm>
      </div>

      {/* Search and Filters */}
      <Card className="border shadow-xs">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-6 w-6" />
                    </div>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories?.data?.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.data.map((category) => (
                <Card
                  key={category.id}
                  className="relative group border shadow-xs hover:border-border transition-colors"
                >
                  <CardContent className="p-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-4 h-4 rounded-full border shadow-xs"
                          style={{ backgroundColor: category.color }}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <CategoryEditForm category={category}>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </CategoryEditForm>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Category
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {category.name}"? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteCategory(
                                        category.id,
                                        category.name,
                                      )
                                    }
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={deleteCategory.isPending}
                                  >
                                    {deleteCategory.isPending
                                      ? "Deleting..."
                                      : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div>
                        <h3 className="font-semibold text-base leading-tight">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {category.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
                        <span>
                          Created{" "}
                          {new Date(category.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {categories.totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  Showing {(page - 1) * 20 + 1} to{" "}
                  {Math.min(page * 20, categories.total)} of {categories.total}{" "}
                  categories
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
                    disabled={page >= categories.totalPages}
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
              <Folder className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
              <h3 className="text-base font-semibold mb-1">
                No categories found
              </h3>
              <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Create your first category to organize your tasks!"}
              </p>
              {!searchQuery && (
                <CategoryCreateForm>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Create Category
                  </Button>
                </CategoryCreateForm>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
