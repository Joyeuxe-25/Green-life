"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { ProgramForm } from "@/components/program-form";
import {
  getProgramContent,
  updateProgramContent,
  type ProgramContentInput,
  type ProgramContentItem
} from "@/lib/admin-api";

export default function UpdateProgramPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [program, setProgram] = useState<ProgramContentItem | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getProgramContent(params.id)
      .then((data) => setProgram(data.program))
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load program."
        )
      )
      .finally(() => setIsLoading(false));
  }, [params.id]);

  async function handleSubmit(input: ProgramContentInput) {
    setError("");
    setIsSubmitting(true);
    try {
      await updateProgramContent(params.id, input);
      router.replace("/programs");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update program."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Programs
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Update Program
          </h2>
        </div>
        <Link
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
          href="/programs"
        >
          Back
        </Link>
      </div>
      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Loading program...
        </div>
      ) : null}
      {!isLoading && program ? (
        <ProgramForm
          initialProgram={program}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      ) : null}
    </AdminShell>
  );
}
