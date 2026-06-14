"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  deleteProgramContent,
  listProgramContent,
  type ProgramContentItem
} from "@/lib/admin-api";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    listProgramContent()
      .then((data) => setPrograms(data.programs))
      .catch((loadError) =>
        setError(
          loadError instanceof Error ? loadError.message : "Could not load programs."
        )
      )
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(program: ProgramContentItem) {
    const confirmed = window.confirm(`Delete program "${program.title}"?`);
    if (!confirmed) {
      return;
    }

    setDeletingId(program.id);
    setError("");
    try {
      await deleteProgramContent(program.id);
      setPrograms((currentPrograms) =>
        currentPrograms.filter((item) => item.id !== program.id)
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete program."
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
              Website Content
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Programs
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage public program content without hardcoding page sections.
            </p>
          </div>
          <Link
            className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95"
            href="/programs/add"
          >
            Add Program
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        {error ? <ErrorBox message={error} /> : null}
        {isLoading ? <StateText text="Loading programs..." /> : null}
        {!isLoading && programs.length === 0 ? (
          <StateText text="No programs yet." />
        ) : null}
        {!isLoading && programs.length > 0 ? (
          <div className="grid gap-3">
            {programs.map((program) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-sm"
                key={program.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-semibold text-foreground">
                        {program.title}
                      </h3>
                      <Badge>{program.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {program.slug} | order {program.display_order}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {program.summary || "No summary set"}
                    </p>
                  </div>
                  <Actions
                    deleting={deletingId === program.id}
                    editHref={`/programs/update/${program.id}`}
                    onDelete={() => void handleDelete(program)}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}

function Actions({
  deleting,
  editHref,
  onDelete
}: {
  deleting: boolean;
  editHref: string;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
        href={editHref}
      >
        Edit
      </Link>
      <button
        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-65"
        disabled={deleting}
        onClick={onDelete}
        type="button"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold capitalize text-primary">
      {children}
    </span>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  );
}

function StateText({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
      {text}
    </div>
  );
}
