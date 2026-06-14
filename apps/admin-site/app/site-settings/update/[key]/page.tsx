"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { SiteSettingForm } from "@/components/site-setting-form";
import {
  getSiteSetting,
  updateSiteSetting,
  type SiteSettingInput,
  type SiteSettingItem
} from "@/lib/admin-api";

export default function UpdateSiteSettingPage() {
  const router = useRouter();
  const params = useParams<{ key: string }>();
  const settingKey = decodeURIComponent(params.key);
  const [setting, setSetting] = useState<SiteSettingItem | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getSiteSetting(settingKey)
      .then((data) => setSetting(data.setting))
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load site setting."
        )
      )
      .finally(() => setIsLoading(false));
  }, [settingKey]);

  async function handleSubmit(input: SiteSettingInput) {
    setError("");
    setIsSubmitting(true);
    try {
      await updateSiteSetting(settingKey, input);
      router.replace("/site-settings");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update site setting."
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
            Site Settings
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Update Site Setting
          </h2>
        </div>
        <Link
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
          href="/site-settings"
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
          Loading site setting...
        </div>
      ) : null}
      {!isLoading && setting ? (
        <SiteSettingForm
          initialSetting={setting}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      ) : null}
    </AdminShell>
  );
}
