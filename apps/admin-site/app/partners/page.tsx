"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  deletePartnerItem,
  listPartners,
  resolveAdminMediaUrl,
  type PartnerItem
} from "@/lib/admin-api";

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    listPartners()
      .then((data) => setPartners(data.partners))
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load partners."
        )
      )
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(item: PartnerItem) {
    const confirmed = window.confirm(`Delete "${item.name}"?`);
    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setError("");
    try {
      await deletePartnerItem(item.id);
      setPartners((currentPartners) =>
        currentPartners.filter((partner) => partner.id !== item.id)
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete partner."
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
              Relationship management
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              Partners
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage partner listings and logos used by the public website.
            </p>
          </div>
          <Link
            className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95"
            href="/partners/add"
          >
            Add Partner
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
            Loading partners...
          </div>
        ) : null}

        {!isLoading && partners.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
            No partners yet. Use Add Partner to create the first listing.
          </div>
        ) : null}

        {!isLoading && partners.length > 0 ? (
          <div className="grid gap-3">
            {partners.map((item) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-sm"
                key={item.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {item.logo_url && !item.is_text_only ? (
                      <img
                        alt={item.logo_alt_text || `${item.name} logo`}
                        className="h-14 w-14 flex-none rounded-lg border border-border bg-white object-contain p-1"
                        src={resolveAdminMediaUrl(item.logo_url)}
                      />
                    ) : (
                      <div className="grid h-14 w-14 flex-none place-items-center rounded-lg border border-border bg-muted px-2 text-center text-xs font-semibold text-muted-foreground">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold capitalize text-primary">
                          {item.status}
                        </span>
                        {item.is_text_only ? (
                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                            text only
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.website_url || "No website URL"}
                      </p>
                      {item.description ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
                      href={`/partners/update/${item.id}`}
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