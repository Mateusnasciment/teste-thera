import { type ReactNode } from "react";
import { DashboardLayout } from "~/components/layout/dashboard-layout";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardShell({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
