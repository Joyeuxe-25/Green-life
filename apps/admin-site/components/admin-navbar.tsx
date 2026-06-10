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
          className="inline-flex shrink-0 items-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          Menu
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
        <div className="min-w-0 rounded-lg border border-border bg-background px-3 py-2">
          <p className="truncate font-medium text-foreground">{admin.name}</p>
          <p className="max-w-[14rem] truncate text-xs text-muted-foreground sm:max-w-xs">
            {admin.email}
          </p>
        </div>
        <button
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary"
          onClick={onLogout}
          type="button"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
