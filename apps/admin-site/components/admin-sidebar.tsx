import Link from "next/link";

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

const bottomItems = [
  { label: "Change Password", href: "/change-password" },
  { label: "Logout", href: "/login" }
];

export function AdminSidebar() {
  return (
    <aside className="flex min-h-screen w-full flex-col border-r border-border bg-white p-5 md:w-72">
      <Link className="mb-6 font-semibold text-primary" href="/dashboard">
        GLR Admin
      </Link>
      <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-5">
        <ul className="flex flex-col gap-3 text-sm">
          {primaryItems.map((item) => (
            <li key={item.href}>
              <Link className="font-medium hover:text-primary" href={item.href}>
                {item.label}
              </Link>
              {item.children ? (
                <ul className="mt-2 flex flex-col gap-2 pl-4 text-foreground/65">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link className="hover:text-primary" href={child.href}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        <ul className="mt-auto flex flex-col gap-2 border-t border-border pt-4 text-sm">
          {bottomItems.map((item) => (
            <li key={item.href}>
              <Link className="hover:text-primary" href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
