"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/admin-navbar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { getCurrentAdmin, logoutAdmin, type AdminUser } from "@/lib/admin-api";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getCurrentAdmin()
      .then(({ admin: currentAdmin }) => {
        if (isMounted) {
          setAdmin(currentAdmin);
          setIsCheckingSession(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          router.replace("/login");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    setLogoutError("");
    try {
      await logoutAdmin();
      router.replace("/login");
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Logout failed. Please try again."
      );
    }
  }

  if (isCheckingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6 text-foreground">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-7 text-center shadow-lg shadow-slate-200/60">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Checking session
          </p>
          <p className="mt-2 text-sm text-foreground/65">
            Confirming your admin access.
          </p>
        </div>
      </main>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground lg:grid lg:grid-cols-[18rem_1fr]">
      <div className="hidden lg:block">
        <AdminSidebar admin={admin} onLogout={handleLogout} />
      </div>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close admin menu"
            className="absolute inset-0 bg-black/35"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          />
          <div className="relative h-full w-[min(20rem,88vw)]">
            <AdminSidebar
              admin={admin}
              onClose={() => setIsSidebarOpen(false)}
              onLogout={handleLogout}
              onNavigate={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="min-w-0">
        <AdminNavbar
          admin={admin}
          onLogout={handleLogout}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {logoutError ? (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {logoutError}
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
