"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { PartnerForm } from "@/components/partner-form";
import { createPartnerItem, type PartnerInput } from "@/lib/admin-api";

export default function AddPartnerPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(input: PartnerInput) {
    setError("");
    setIsSubmitting(true);
    try {
      await createPartnerItem(input);
      router.replace("/partners");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Could not create partner."
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
            Partners
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Add Partner
          </h2>
        </div>
        <Link
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
          href="/partners"
        >
          Back to Partners
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <PartnerForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel="Create partner"
      />
    </AdminShell>
  );
}
