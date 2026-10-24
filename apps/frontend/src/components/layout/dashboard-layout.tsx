"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { data, isPending, settled } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (settled && !isPending && !data?.user) {
      router.push("/sign-in");
    }
  }, [settled, isPending, data, router]);

  if (!settled || isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg animate-pulse">
            TL
          </div>
          <p className="text-xs text-muted-foreground font-medium animate-pulse">
            Loading TutorlinkNG workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen
      className="h-svh overflow-hidden no-scrollbar bg-sidebar"
      style={
        {
          "--sidebar-width": "17.25rem",
          "--sidebar-width-icon": "5.125rem",
        } as CSSProperties
      }
    >
      <AppSidebar />

      <main className="flex flex-1 flex-col overflow-hidden bg-sidebar p-0 md:p-2 md:pl-0 min-w-0">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background md:rounded-2xl border border-border/40 shadow-xs">
          <AppTopbar />
          <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
