"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  deleteProjectItem,
  listProjects,
  type ProjectItem
} from "@/lib/admin-api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  async function loadProjects() {
    setError("");
    setIsLoading(true);
    try {
      const data = await listProjects();
      setProjects(data.projects);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load projects."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  async function handleDelete(item: ProjectItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This will remove it from the admin list.`
    );
    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setError("");
    try {
      await deleteProjectItem(item.id);
      setProjects((currentProjects) =>
        currentProjects.filter((projectItem) => projectItem.id !== item.id)
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete project."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <AdminShell>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Content management
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Projects
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Create, update, activate, complete, or remove project records.
              Image upload will come later with R2 media support.
            </p>
          </div>
          <Link
            className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95"
            href="/projects/add"
          >
            Add Project
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
            Loading projects...
          </div>
        ) : null}

        {!isLoading && projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
            No projects yet. Use Add Project to create the first project record.
          </div>
        ) : null}

        {!isLoading && projects.length > 0 ? (
          <div className="grid gap-3">
            {projects.map((item) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-sm"
                key={item.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold capitalize text-primary">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[item.district, item.sector].filter(Boolean).join(", ") ||
                        "No location set"}
                      {item.start_date
                        ? ` • ${new Date(item.start_date).toLocaleDateString()}`
                        : ""}
                      {item.end_date
                        ? ` - ${new Date(item.end_date).toLocaleDateString()}`
                        : ""}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
                      href={`/projects/update/${item.id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-65"
                      disabled={deletingId === item.id}
                      onClick={() => void handleDelete(item)}
                      type="button"
                    >
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}
