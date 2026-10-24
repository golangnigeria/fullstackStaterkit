"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signout } from "@/lib/auth-client";
import { useGetTodoStats } from "@/api/hooks/use-todo-query";
import { useGetAllCategories } from "@/api/hooks/use-category-query";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HomeIcon,
  CalendarCheckIcon,
  StackIcon,
  GearIcon,
  SidebarCollapseIcon,
} from "./icons";
import {
  GraduationCap,
  Moon,
  Sun,
  LogOut,
  Sparkles,
} from "lucide-react";

const menuButtonClassName = cn(
  "h-11 gap-3 rounded-lg bg-transparent py-2 pl-3 pr-2.5 text-sm font-medium text-muted-foreground transition-all",
  "hover:bg-sidebar-accent hover:text-foreground",
  "data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:font-semibold data-[active=true]:shadow-xs",
  "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
);

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  const { theme, setTheme } = useTheme();
  const { state, toggleSidebar, isMobile, setOpenMobile } = useSidebar();

  const { data: stats } = useGetTodoStats();
  const { data: categories } = useGetAllCategories({
    query: { page: 1, limit: 1 },
  });

  const isDark = theme === "dark";

  const handleSignOut = async () => {
    try {
      await signout();
      router.push("/sign-in");
      router.refresh();
    } catch {
      router.push("/sign-in");
    }
  };

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "TL";

  const navGroups = [
    {
      label: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: HomeIcon,
          badge: undefined,
        },
      ],
    },
    {
      label: "Workspace",
      items: [
        {
          name: "Todos",
          href: "/todos",
          icon: CalendarCheckIcon,
          badge: stats?.active !== undefined ? String(stats.active) : undefined,
        },
        {
          name: "Categories",
          href: "/categories",
          icon: StackIcon,
          badge: categories?.total !== undefined ? String(categories.total) : undefined,
        },
      ],
    },
    {
      label: "Preferences",
      items: [
        {
          name: "Settings",
          href: "/settings",
          icon: GearIcon,
          badge: undefined,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r-0!">
      {/* Sidebar Header with Brand & Collapse Trigger */}
      <SidebarHeader className="relative h-18 flex-row items-center justify-between gap-3 px-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-2.5 transition-opacity group-data-[collapsible=icon]:hidden group"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
            <GraduationCap className="size-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-base font-bold tracking-tight text-foreground leading-none">
              Tutorlink<span className="text-primary">NG</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="size-2.5 text-primary" />
              Workspace
            </span>
          </div>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
          className="size-8 text-muted-foreground hover:text-foreground shrink-0"
        >
          <SidebarCollapseIcon className="size-4.5 transition-transform group-data-[collapsible=icon]:rotate-180" />
        </Button>
      </SidebarHeader>

      {/* Sidebar Navigation Content */}
      <SidebarContent className="gap-4 px-3 py-2 group-data-[collapsible=icon]:overflow-auto!">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="gap-1 p-0">
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        data-active={isActive}
                        className={menuButtonClassName}
                      >
                        <Link
                          href={item.href}
                          onClick={() => {
                            if (isMobile) setOpenMobile(false);
                          }}
                        >
                          <Icon className={cn("size-4.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                          <span className="truncate">{item.name}</span>
                          {item.badge ? (
                            <SidebarMenuBadge className="ml-auto text-[10px] font-semibold px-1.5 py-0.2 bg-muted text-muted-foreground rounded-full">
                              {item.badge}
                            </SidebarMenuBadge>
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Sidebar Footer with Account Dropdown */}
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <SidebarMenu className="gap-0">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    menuButtonClassName,
                    "w-full justify-start text-left px-2! hover:bg-sidebar-accent",
                  )}
                  aria-label={user?.email || "Account"}
                >
                  <div className="flex items-center gap-2.5 min-w-0 w-full">
                    <Avatar className="size-8 shrink-0 border border-border/50">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                      <span className="truncate text-xs font-semibold text-foreground">
                        {user?.email?.split("@")[0] || "User"}
                      </span>
                      <span className="truncate text-[10px] text-muted-foreground">
                        {user?.email || "Signed in"}
                      </span>
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-foreground">
                      {user?.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setTheme(isDark ? "light" : "dark")}>
                    {isDark ? <Sun className="size-4 mr-2" /> : <Moon className="size-4 mr-2" />}
                    <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <GearIcon className="size-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="size-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
