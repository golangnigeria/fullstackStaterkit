import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace - TutorlinkNG",
  description: "Manage your tasks, categories, and tutoring schedule.",
};

export default function DashboardRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
