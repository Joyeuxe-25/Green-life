"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { ContentBlockForm } from "@/components/content-block-form";
import { createContentBlock, type ContentBlockInput } from "@/lib/admin-api";

export default function AddSiteContentPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(input: ContentBlockInput) {
    setError("");
    setIsSubmitting(true);
    try {
      await createContentBlock(input);
      router.replace("/site-content");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Could not create content block."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <PageHeader href="/site-content" label="Site Content" title="Add Content Block" />
      {error ? <ErrorBox message={error} /> : null}
      <ContentBlockForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel="Create content block"
      />
    </AdminShell>
  );
}

function PageHeader({
  href,
  label,
  title
}: {
  href: string;
  label: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {label}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <Link
        className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
        href={href}
      >
        Back
      </Link>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  );
}
