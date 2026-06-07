import Link from "next/link";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Projects", href: "/projects" },
  { label: "Impact", href: "/impact" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Staff", href: "/staff" },
  { label: "Partners", href: "/partners" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
  { label: "Get Involved", href: "/get-involved" }
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <Link className="font-semibold text-primary" href="/">
          Green Life Rwanda
        </Link>
        <nav aria-label="Public navigation">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-foreground/75">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-primary" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
