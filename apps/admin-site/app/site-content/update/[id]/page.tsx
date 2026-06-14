"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { ContentBlockForm } from "@/components/content-block-form";
import {
  getContentBlock,
  updateContentBlock,
  type ContentBlockInput,
  type ContentBlockItem
} from "@/lib/admin-api";

export default function UpdateSiteContentItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [block, setBlock] = useState<ContentBlockItem | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getContentBlock(params.id)
      .then((data) => setBlock(data.block))
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load content block."
        )
      )
      .finally(() => setIsLoading(false));
  }, [params.id]);

  async function handleSubmit(input: ContentBlockInput) {
    setError("");
    setIsSubmitting(true);
    try {
      await updateContentBlock(params.id, input);
      router.replace("/site-content");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update content block."
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
            Site Content
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Update Content Block
          </h2>
        </div>
        <Link
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
          href="/site-content"
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
          Loading content block...
        </div>
      ) : null}
      {!isLoading && block ? (
        <ContentBlockForm
          initialBlock={block}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      ) : null}
    </AdminShell>
  );
}
