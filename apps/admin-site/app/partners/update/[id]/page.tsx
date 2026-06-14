"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { PartnerForm } from "@/components/partner-form";
import {
  getPartnerItem,
  updatePartnerItem,
  type PartnerInput,
  type PartnerItem
} from "@/lib/admin-api";

export default function UpdatePartnerItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [partner, setPartner] = useState<PartnerItem | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getPartnerItem(params.id)
      .then(({ partner: loadedPartner }) => {
        if (isMounted) {
          setPartner(loadedPartner);
          setIsLoading(false);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load partner."
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  async function handleSubmit(input: PartnerInput) {
    setError("");
    setIsSubmitting(true);
    try {
      await updatePartnerItem(params.id, input);
      router.replace("/partners");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update partner."
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
            Update Partner
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

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Loading partner...
        </div>
      ) : null}

      {!isLoading && partner ? (
        <PartnerForm
          initialPartner={partner}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      ) : null}
    </AdminShell>
  );
}
