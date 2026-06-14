"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { SiteSettingForm } from "@/components/site-setting-form";
import { createSiteSetting, type SiteSettingInput } from "@/lib/admin-api";

export default function AddSiteSettingPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(input: SiteSettingInput) {
    setError("");
    setIsSubmitting(true);
    try {
      await createSiteSetting(input);
      router.replace("/site-settings");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Could not create site setting."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <Header href="/site-settings" title="Add Site Setting" />
      {error ? <ErrorBox message={error} /> : null}
      <SiteSettingForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel="Create setting"
      />
    </AdminShell>
  );
}

function Header({ href, title }: { href: string; title: string }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Site Settings
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
