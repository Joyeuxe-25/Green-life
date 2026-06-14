"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  deleteSiteSetting,
  listSiteSettings,
  type SiteSettingItem
} from "@/lib/admin-api";

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingKey, setDeletingKey] = useState("");

  useEffect(() => {
    listSiteSettings()
      .then((data) => setSettings(data.settings))
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load site settings."
        )
      )
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(setting: SiteSettingItem) {
    const confirmed = window.confirm(`Delete setting "${setting.key}"?`);
    if (!confirmed) {
      return;
    }

    setDeletingKey(setting.key);
    setError("");
    try {
      await deleteSiteSetting(setting.key);
      setSettings((currentSettings) =>
        currentSettings.filter((item) => item.key !== setting.key)
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete site setting."
      );
    } finally {
      setDeletingKey("");
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
              Site Settings
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Manage global public-site values and small reusable settings.
            </p>
          </div>
          <Link
            className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95"
            href="/site-settings/add"
          >
            Add Setting
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        {error ? <ErrorBox message={error} /> : null}
        {isLoading ? <StateText text="Loading site settings..." /> : null}
        {!isLoading && settings.length === 0 ? (
          <StateText text="No site settings yet." />
        ) : null}
        {!isLoading && settings.length > 0 ? (
          <div className="grid gap-3">
            {settings.map((setting) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-sm"
                key={setting.key}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-foreground">
                      {setting.label}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {setting.group_key} / {setting.key} | {setting.field_type}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {setting.value || "No value set"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
                      href={`/site-settings/update/${encodeURIComponent(setting.key)}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-65"
                      disabled={deletingKey === setting.key}
                      onClick={() => void handleDelete(setting)}
                      type="button"
                    >
                      {deletingKey === setting.key ? "Deleting..." : "Delete"}
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
