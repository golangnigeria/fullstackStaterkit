"use client";

import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/auth-client";
import { useGetTodoStats } from "@/api/hooks/use-todo-query";
import { useGetAllCategories } from "@/api/hooks/use-category-query";
import {
  User,
  Palette,
  Bell,
  Shield,
  Database,
  CheckCircle2,
  ListTodo,
  Layers,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const { data } = useSession();
  const user = data?.user;
  const { theme } = useTheme();

  const { data: stats } = useGetTodoStats();
  const { data: categories } = useGetAllCategories({
    query: { page: 1, limit: 1 },
  });

  const themeName =
    theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light";

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "TL";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
              Settings & Workspace
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="size-3" />
              Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your account credentials, workspace preferences, and application themes.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card className="rounded-xl border border-border/40 shadow-xs bg-card hover:border-border/70 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="size-4" />
              </div>
              Account Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-13 rounded-xl ring-2 ring-border/50">
                <AvatarFallback className="text-base bg-primary/10 text-primary font-bold rounded-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground text-sm truncate">
                  {user?.email?.split("@")[0] || "User"}
                </h3>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {user?.email || "No email address"}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="secondary" className="text-[10px] font-medium h-5">
                    Verified Member
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    ID: {user?.id ? String(user.id) : "2"}
                  </span>
                </div>
              </div>
            </div>
            <Separator className="bg-border/40" />
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-foreground">Security Credentials</p>
              <div className="space-y-1 text-muted-foreground leading-relaxed">
                <p>• Authentication Protocol: Limen Auth (Secured Sessions)</p>
                <p>• Cookie Domain: Same-Site Strict HTTP-Only</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="rounded-xl border border-border/40 shadow-xs bg-card hover:border-border/70 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Palette className="size-4" />
              </div>
              Appearance & Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-foreground">Interface Theme</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Active Mode: <span className="font-semibold text-foreground">{themeName}</span>
                </p>
              </div>
              <ThemeToggle />
            </div>
            <Separator className="bg-border/40" />
            <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
              <p>• <span className="font-medium text-foreground">Light Theme</span>: Designed for high contrast and daylight reading</p>
              <p>• <span className="font-medium text-foreground">Dark Theme</span>: Sleek OKLCH palette engineered for minimal eye strain</p>
              <p>• <span className="font-medium text-foreground">System Theme</span>: Automatically aligns with your operating system</p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="rounded-xl border border-border/40 shadow-xs bg-card hover:border-border/70 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Bell className="size-4" />
              </div>
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/20">
              <div>
                <p className="font-medium text-xs sm:text-sm text-foreground">Task Deadlines & Due Dates</p>
                <p className="text-[11px] text-muted-foreground">
                  Alerts when scheduled tutoring goals are approaching
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/20">
              <div>
                <p className="font-medium text-xs sm:text-sm text-foreground">Weekly Digest</p>
                <p className="text-[11px] text-muted-foreground">
                  Overview of completed tasks and active subjects
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="rounded-xl border border-border/40 shadow-xs bg-card hover:border-border/70 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Shield className="size-4" />
              </div>
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed">
            <div className="p-2.5 rounded-lg border border-border/40 bg-muted/20">
              <p className="font-medium text-foreground text-xs sm:text-sm">End-to-End Transport Security</p>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                All requests, headers, and credentials are encrypted with TLS 1.3 in transit.
              </p>
            </div>
            <div className="p-2.5 rounded-lg border border-border/40 bg-muted/20">
              <p className="font-medium text-foreground text-xs sm:text-sm">Isolated Session Storage</p>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                Session tokens are bound to device signatures with automatic rotation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Management & Workspace Summary */}
        <Card className="lg:col-span-2 rounded-xl border border-border/40 shadow-xs bg-card hover:border-border/70 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--dashboard-scheduled)_15%,transparent)] text-[var(--dashboard-scheduled)]">
                <Database className="size-4" />
              </div>
              Workspace Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-4 border border-border/40 rounded-xl bg-muted/20 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Total Tasks</span>
                  <ListTodo className="size-4 text-[var(--dashboard-scheduled)]" />
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold tracking-tight text-foreground font-mono">
                    {stats?.total ?? 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                    All-time recorded tasks
                  </p>
                </div>
              </div>

              <div className="p-4 border border-border/40 rounded-xl bg-muted/20 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Completed</span>
                  <CheckCircle2 className="size-4 text-[var(--dashboard-completed)]" />
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold tracking-tight text-foreground font-mono">
                    {stats?.completed ?? 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                    Resolved milestones
                  </p>
                </div>
              </div>

              <div className="p-4 border border-border/40 rounded-xl bg-muted/20 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Categories</span>
                  <Layers className="size-4 text-purple-500" />
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold tracking-tight text-foreground font-mono">
                    {categories?.total ?? 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                    Organized subjects
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Information */}
      <Card className="rounded-xl border border-border/40 shadow-xs bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">System Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-xs">
            <div className="p-2.5 rounded-lg border border-border/30 bg-muted/10">
              <p className="font-semibold text-foreground">Frontend Framework</p>
              <p className="text-muted-foreground mt-0.5 font-mono text-[11px]">Next.js 15 App Router</p>
            </div>
            <div className="p-2.5 rounded-lg border border-border/30 bg-muted/10">
              <p className="font-semibold text-foreground">Styling Engine</p>
              <p className="text-muted-foreground mt-0.5 font-mono text-[11px]">Tailwind CSS v4 + OKLCH</p>
            </div>
            <div className="p-2.5 rounded-lg border border-border/30 bg-muted/10">
              <p className="font-semibold text-foreground">Backend API</p>
              <p className="text-muted-foreground mt-0.5 font-mono text-[11px]">Go Echo + ts-rest</p>
            </div>
            <div className="p-2.5 rounded-lg border border-border/30 bg-muted/10">
              <p className="font-semibold text-foreground">System Status</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Operational
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
