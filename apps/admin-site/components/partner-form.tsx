"use client";

import { FormEvent, useState } from "react";
import { EntityImageField } from "@/components/entity-image-field";
import type { PartnerInput, PartnerItem, PartnerStatus } from "@/lib/admin-api";

type PartnerFormProps = {
  initialPartner?: PartnerItem;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (input: PartnerInput) => Promise<void>;
};

const statusOptions: PartnerStatus[] = ["active", "hidden"];

export function PartnerForm({
  initialPartner,
  isSubmitting,
  onSubmit,
  submitLabel
}: PartnerFormProps) {
  const [name, setName] = useState(initialPartner?.name ?? "");
  const [slug, setSlug] = useState(initialPartner?.slug ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(initialPartner?.website_url ?? "");
  const [description, setDescription] = useState(
    initialPartner?.description ?? ""
  );
  const [displayOrder, setDisplayOrder] = useState(
    String(initialPartner?.display_order ?? 0)
  );
  const [status, setStatus] = useState<PartnerStatus>(
    initialPartner?.status ?? "active"
  );
  const [isTextOnly, setIsTextOnly] = useState(
    Boolean(initialPartner?.is_text_only ?? 0)
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    await onSubmit({
      name: name.trim(),
      slug: slug.trim(),
      websiteUrl: websiteUrl.trim(),
      description: description.trim(),
      displayOrder: Number.parseInt(displayOrder, 10) || 0,
      status,
      isTextOnly,
      imageFile,
      removeImage
    });
  }

  return (
    <form
      className="grid gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
      onSubmit={handleSubmit}
    >
      <EntityImageField
        currentImageUrl={initialPartner?.logo_url}
        description="Upload a Partner logo or image through the existing media library."
        disabled={isSubmitting}
        label="Partner logo/image"
        onChange={setImageFile}
        onRemoveChange={setRemoveImage}
        previewAlt={initialPartner?.name ? `${initialPartner.name} logo preview` : "Partner logo preview"}
        removeImage={removeImage}
        selectedFile={imageFile}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Name" required>
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </Field>

        <Field label="Slug">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="Generated from name if blank"
            value={slug}
          />
        </Field>
      </div>

      <Field label="Website URL">
        <input
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setWebsiteUrl(event.target.value)}
          type="url"
          value={websiteUrl}
        />
      </Field>

      <Field label="Description">
        <textarea
          className="min-h-32 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Display order">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setDisplayOrder(event.target.value)}
            type="number"
            value={displayOrder}
          />
        </Field>

        <Field label="Status">
          <select
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setStatus(event.target.value as PartnerStatus)}
            value={status}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-foreground">
        <input
          checked={isTextOnly}
          className="h-4 w-4"
          disabled={isSubmitting}
          onChange={(event) => setIsTextOnly(event.target.checked)}
          type="checkbox"
        />
        Text-only partner listing
      </label>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  children,
  label,
  required
}: {
  children: React.ReactNode;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      <span>
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      {children}
    </label>
  );
}