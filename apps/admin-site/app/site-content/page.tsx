"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  deleteContentBlock,
  listContentBlocks,
  type ContentBlockItem
} from "@/lib/admin-api";

export default function SiteContentPage() {
  const [blocks, setBlocks] = useState<ContentBlockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    listContentBlocks()
      .then((data) => setBlocks(data.blocks))
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load content blocks."
        )
      )
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(block: ContentBlockItem) {
    const confirmed = window.confirm(
      `Delete content block "${block.page_key}/${block.block_key}"?`
    );
    if (!confirmed) {
      return;
    }

    setDeletingId(block.id);
    setError("");
    try {
      await deleteContentBlock(block.id);
      setBlocks((currentBlocks) =>
        currentBlocks.filter((item) => item.id !== block.id)
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete content block."
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
              Site Content
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage flexible page content blocks for the future public website.
            </p>
          </div>
          <Link
            className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95"
            href="/site-content/add"
          >
            Add Content Block
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {isLoading ? <StateText text="Loading content blocks..." /> : null}
        {!isLoading && blocks.length === 0 ? (
          <StateText text="No content blocks yet." />
        ) : null}
        {!isLoading && blocks.length > 0 ? (
          <div className="grid gap-3">
            {blocks.map((block) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-sm"
                key={block.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-semibold text-foreground">
                        {block.page_key} / {block.block_key}
                      </h3>
                      <Badge>{block.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {block.block_type} | order {block.display_order}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {block.title || block.summary || "No title or summary set"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
                      href={`/site-content/update/${block.id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-65"
                      disabled={deletingId === block.id}
                      onClick={() => void handleDelete(block)}
                      type="button"
                    >
                      {deletingId === block.id ? "Deleting..." : "Delete"}
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

function StateText({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
      {text}
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
