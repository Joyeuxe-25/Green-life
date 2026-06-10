import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";

export default function UpdateProjectPage() {
  return (
    <AdminShell>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Projects
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Select a Project
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Choose a project from the projects list to edit it.
        </p>
        <Link
          className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95"
          href="/projects"
        >
          Go to Projects List
        </Link>
      </section>
    </AdminShell>
  );
}
