import { Menu } from "lucide-react";
import { AdminLiveTime } from "@/components/admin-live-time";
import { AdminProfileMenu } from "@/components/admin-profile-menu";
import type { AdminUser } from "@/lib/admin-api";

type AdminNavbarProps = {
  admin: AdminUser;
  onMenuClick: () => void;
  onLogout: () => void;
};

export function AdminNavbar({
  admin,
  onLogout,
  onMenuClick
}: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-border bg-card/95 px-5 py-4 shadow-sm backdrop-blur sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open admin menu"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu aria-hidden="true" size={20} />
        </button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Admin workspace
          </p>
          <h1 className="mt-1 truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Green Life Rwanda Admin
          </h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/70">
        <AdminLiveTime />
        <AdminProfileMenu admin={admin} onLogout={onLogout} />
      </div>
    </header>
  );
}
