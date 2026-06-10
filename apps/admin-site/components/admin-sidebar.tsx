import Link from "next/link";
import type { AdminUser } from "@/lib/admin-api";

type AdminNavItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

const primaryItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "News",
    href: "/news",
    children: [
      { label: "Add New", href: "/news/add" },
      { label: "Update", href: "/news/update" }
    ]
  },
  {
    label: "Events",
    href: "/events",
    children: [
      { label: "Add New", href: "/events/add" },
      { label: "Update", href: "/events/update" }
    ]
  },
  {
    label: "Projects",
    href: "/projects",
    children: [
      { label: "Add New", href: "/projects/add" },
      { label: "Update", href: "/projects/update" }
    ]
  },
  {
    label: "Staff",
    href: "/staff",
    children: [
      { label: "Add New", href: "/staff/add" },
      { label: "Update", href: "/staff/update" }
    ]
  },
  {
    label: "Partners",
    href: "/partners",
    children: [
      { label: "Add New", href: "/partners/add" },
      { label: "Update", href: "/partners/update" }
    ]
  },
  { label: "Contact Messages", href: "/contact-messages" },
  { label: "Donation Messages", href: "/donation-messages" }
];

const bottomItems = [{ label: "Change Password", href: "/change-password" }];

type AdminSidebarProps = {
  admin: AdminUser;
  onClose?: () => void;
  onLogout: () => void;
  onNavigate?: () => void;
};

export function AdminSidebar({
  admin,
  onClose,
  onLogout,
  onNavigate
}: AdminSidebarProps) {
  return (
    <aside className="flex h-full min-h-screen w-full flex-col overflow-y-auto border-r border-border bg-card p-4 shadow-xl sm:p-5 lg:sticky lg:top-0 lg:w-72 lg:shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <Link
          className="block min-w-0 flex-1 rounded-xl bg-primary px-4 py-3 text-primary-foreground shadow-sm"
          href="/dashboard"
          onClick={onNavigate}
        >
          <span className="block text-sm font-semibold uppercase tracking-wide">
            Green Life Rwanda
          </span>
          <span className="mt-1 block text-lg font-bold">GLR Admin</span>
        </Link>
        {onClose ? (
          <button
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground lg:hidden"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        ) : null}
      </div>
      <div className="mb-5 rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">{admin.name}</p>
        <p className="mt-1 break-all">{admin.email}</p>
      </div>
      <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-5">
        <ul className="flex list-none flex-col gap-1 p-0 text-sm">
          {primaryItems.map((item) => (
            <li key={item.href}>
              <Link
                className="block rounded-lg px-3 py-2 font-semibold text-foreground transition hover:bg-background hover:text-primary"
                href={item.href}
                onClick={onNavigate}
              >
                {item.label}
              </Link>
              {item.children ? (
                <ul className="mb-2 ml-3 mt-1 flex list-none flex-col gap-1 border-l border-border pl-3 text-muted-foreground">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        className="block rounded-md px-3 py-1.5 text-xs font-medium transition hover:bg-background hover:text-primary"
                        href={child.href}
                        onClick={onNavigate}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        <ul className="mt-auto flex list-none flex-col gap-2 border-t border-border p-0 pt-4 text-sm">
          {bottomItems.map((item) => (
            <li key={item.href}>
              <Link
                className="block rounded-lg px-3 py-2 font-semibold transition hover:bg-background hover:text-primary"
                href={item.href}
                onClick={onNavigate}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="w-full rounded-lg border border-border px-3 py-2 text-left font-semibold text-foreground transition hover:border-primary hover:text-primary"
              onClick={onLogout}
              type="button"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
