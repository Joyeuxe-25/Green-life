import { AdminShell } from "@/components/admin-shell";

const dashboardCards = [
  {
    title: "News",
    description: "Publish updates and announcements later.",
    href: "/news"
  },
  {
    title: "Events",
    description: "Manage upcoming and completed events later.",
    href: "/events"
  },
  {
    title: "Projects",
    description: "Organize project records and impact stories later.",
    href: "/projects"
  },
  {
    title: "Staff",
    description: "Add team profiles when CRUD is approved.",
    href: "/staff"
  },
  {
    title: "Partners",
    description: "Maintain partner names and logo records later.",
    href: "/partners"
  },
  {
    title: "Messages",
    description: "Review contact and donation messages later.",
    href: "/contact-messages"
  }
];

export default function DashboardPage() {
  return (
    <AdminShell>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Dashboard
        </p>
        <div className="mt-3 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Welcome to the Green Life Rwanda admin workspace
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This dashboard is ready for authenticated admin work. CRUD modules,
            media upload, and database-backed content management will be added
            in later approved phases.
          </p>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardCards.map((card) => (
          <a
            className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            href={card.href}
            key={card.title}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              {card.title.slice(0, 1)}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {card.description}
            </p>
          </a>
        ))}
      </section>
    </AdminShell>
  );
}
