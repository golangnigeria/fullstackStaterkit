"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TodoCreateForm } from "@/components/todos/todo-create-form";
import {
  SearchIcon,
  CommandIcon,
  CloseIcon,
  HomeIcon,
  CalendarCheckIcon,
  StackIcon,
  GearIcon,
} from "./icons";
import { Plus } from "lucide-react";

export function AppTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const getPageMeta = () => {
    if (pathname.startsWith("/todos")) {
      return { title: "Tasks & Todos", icon: CalendarCheckIcon };
    }
    if (pathname.startsWith("/categories")) {
      return { title: "Categories", icon: StackIcon };
    }
    if (pathname.startsWith("/settings")) {
      return { title: "Settings", icon: GearIcon };
    }
    return { title: "Dashboard", icon: HomeIcon };
  };

  const { title: pageTitle, icon: PageIcon } = getPageMeta();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/todos?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (window.matchMedia("(max-width: 767px)").matches) {
          setIsMobileSearchOpen(true);
          requestAnimationFrame(() => {
            mobileSearchInputRef.current?.focus();
          });
          return;
        }

        searchInputRef.current?.focus();
      }

      if (event.key === "Escape") {
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="flex h-18 shrink-0 items-center justify-between gap-4 border-b bg-card/60 px-4 md:px-6 backdrop-blur-md">
      {isMobileSearchOpen ? (
        <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2 md:hidden">
          <InputGroup className="h-9 flex-1 rounded-lg border-none bg-muted/60 py-1 pr-2 pl-3">
            <InputGroupAddon className="pl-0 text-muted-foreground">
              <SearchIcon className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              ref={mobileSearchInputRef}
              className="h-full p-0 px-2 text-sm leading-5 placeholder:text-muted-foreground"
              placeholder="Search tasks, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 rounded-lg"
            onClick={() => setIsMobileSearchOpen(false)}
          >
            <CloseIcon className="size-4" />
          </Button>
        </form>
      ) : (
        <>
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger
              size="icon"
              className="shrink-0 md:hidden [&_svg]:size-5!"
            />

            <div className="hidden items-center gap-3 md:flex">
              <div className="flex h-7 items-center gap-2">
                <PageIcon className="size-4.5 text-primary" />
                <span className="text-base font-bold tracking-tight text-foreground">
                  {pageTitle}
                </span>
              </div>
              <div className="flex h-6 items-center gap-1.5 pl-2 border-l border-border/80">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-medium text-muted-foreground">
                  Synced Live
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Search input with ⌘K badge */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block">
              <InputGroup className="h-9 w-64 lg:w-72 shrink-0 rounded-lg border-none bg-muted/70 py-1 pr-2 pl-3 transition-all focus-within:w-80 focus-within:bg-muted focus-within:ring-1 focus-within:ring-ring">
                <InputGroupAddon className="p-0 text-muted-foreground">
                  <SearchIcon className="size-3.5" />
                </InputGroupAddon>
                <InputGroupInput
                  ref={searchInputRef}
                  className="h-full p-0 px-2 text-xs placeholder:text-muted-foreground"
                  placeholder="Search tasks, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery === "" && (
                  <InputGroupAddon align="inline-end" className="p-0 text-muted-foreground">
                    <div className="flex h-5 w-8 items-center justify-center gap-0.5 rounded border border-border/60 bg-background px-1 text-[10px] font-medium shadow-2xs">
                      <CommandIcon className="size-2.5" />
                      <span>K</span>
                    </div>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </form>

            {/* Mobile search trigger button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 shrink-0 md:hidden"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <SearchIcon className="size-4" />
            </Button>

            <ThemeToggle />

            <TodoCreateForm>
              <Button size="sm" className="h-9 gap-1.5 font-medium shadow-xs shadow-primary/20">
                <Plus className="size-4" />
                <span className="hidden sm:inline">New Task</span>
              </Button>
            </TodoCreateForm>
          </div>
        </>
      )}
    </header>
  );
}
