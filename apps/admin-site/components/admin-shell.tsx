import type { ReactNode } from "react";
import { AdminNavbar } from "@/components/admin-navbar";
import { AdminSidebar } from "@/components/admin-sidebar";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[18rem_1fr]">
      <AdminSidebar />
      <div className="min-w-0">
        <AdminNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
