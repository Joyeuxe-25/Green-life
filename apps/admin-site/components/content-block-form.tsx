"use client";

import { FormEvent, useState } from "react";
import type {
  ContentBlockInput,
  ContentBlockItem,
  PublishStatus
} from "@/lib/admin-api";

type ContentBlockFormProps = {
  initialBlock?: ContentBlockItem;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (input: ContentBlockInput) => Promise<void>;
};

const statusOptions: PublishStatus[] = ["draft", "published"];

export function ContentBlockForm({
  initialBlock,
  isSubmitting,
  onSubmit,
  submitLabel
}: ContentBlockFormProps) {
  const [pageKey, setPageKey] = useState(initialBlock?.page_key ?? "");
  const [blockKey, setBlockKey] = useState(initialBlock?.block_key ?? "");
  const [blockType, setBlockType] = useState(
    initialBlock?.block_type ?? "section"
  );
  const [eyebrow, setEyebrow] = useState(initialBlock?.eyebrow ?? "");
  const [title, setTitle] = useState(initialBlock?.title ?? "");
  const [subtitle, setSubtitle] = useState(initialBlock?.subtitle ?? "");
  const [summary, setSummary] = useState(initialBlock?.summary ?? "");
  const [body, setBody] = useState(initialBlock?.body ?? "");
  const [ctaLabel, setCtaLabel] = useState(initialBlock?.cta_label ?? "");
  const [ctaHref, setCtaHref] = useState(initialBlock?.cta_href ?? "");
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState(
    initialBlock?.secondary_cta_label ?? ""
  );
  const [secondaryCtaHref, setSecondaryCtaHref] = useState(
    initialBlock?.secondary_cta_href ?? ""
  );
  const [imageUrl, setImageUrl] = useState(initialBlock?.image_url ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    String(initialBlock?.display_order ?? 0)
  );
  const [status, setStatus] = useState<PublishStatus>(
    initialBlock?.status ?? "draft"
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!pageKey.trim() || !blockKey.trim() || !blockType.trim()) {
      setError("Page key, block key, and block type are required.");
      return;
    }

    await onSubmit({
      pageKey: pageKey.trim(),
      blockKey: blockKey.trim(),
      blockType: blockType.trim(),
      eyebrow: eyebrow.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      summary: summary.trim(),
      body: body.trim(),
      ctaLabel: ctaLabel.trim(),
      ctaHref: ctaHref.trim(),
      secondaryCtaLabel: secondaryCtaLabel.trim(),
      secondaryCtaHref: secondaryCtaHref.trim(),
      imageUrl: imageUrl.trim(),
      displayOrder: Number.parseInt(displayOrder, 10) || 0,
      status
    });
  }

  return (
    <form
      className="grid gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="Page key" required>
          <Input disabled={isSubmitting} onChange={setPageKey} value={pageKey} />
        </Field>
        <Field label="Block key" required>
          <Input disabled={isSubmitting} onChange={setBlockKey} value={blockKey} />
        </Field>
        <Field label="Block type" required>
          <Input
            disabled={isSubmitting}
            onChange={setBlockType}
            value={blockType}
          />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="Eyebrow">
          <Input disabled={isSubmitting} onChange={setEyebrow} value={eyebrow} />
        </Field>
        <Field label="Title">
          <Input disabled={isSubmitting} onChange={setTitle} value={title} />
        </Field>
        <Field label="Subtitle">
          <Input disabled={isSubmitting} onChange={setSubtitle} value={subtitle} />
        </Field>
      </div>

      <Field label="Summary">
        <Textarea disabled={isSubmitting} onChange={setSummary} value={summary} />
      </Field>

      <Field label="Body">
        <Textarea
          disabled={isSubmitting}
          minHeight="min-h-48"
          onChange={setBody}
          value={body}
        />
      </Field>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="CTA label">
          <Input disabled={isSubmitting} onChange={setCtaLabel} value={ctaLabel} />
        </Field>
        <Field label="CTA href">
          <Input disabled={isSubmitting} onChange={setCtaHref} value={ctaHref} />
        </Field>
        <Field label="Secondary CTA label">
          <Input
            disabled={isSubmitting}
            onChange={setSecondaryCtaLabel}
            value={secondaryCtaLabel}
          />
        </Field>
        <Field label="Secondary CTA href">
          <Input
            disabled={isSubmitting}
            onChange={setSecondaryCtaHref}
            value={secondaryCtaHref}
          />
        </Field>
      </div>

      <Field label="Image URL">
        <Input disabled={isSubmitting} onChange={setImageUrl} value={imageUrl} />
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
            onChange={(event) => setStatus(event.target.value as PublishStatus)}
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

      <FormError message={error} />
      <SubmitButton isSubmitting={isSubmitting} label={submitLabel} />
    </form>
  );
}

function Input({
  disabled,
  onChange,
  value
}: {
  disabled: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <input
      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    />
  );
}

function Textarea({
  disabled,
  minHeight = "min-h-28",
  onChange,
  value
}: {
  disabled: boolean;
  minHeight?: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <textarea
      className={`${minHeight} w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary`}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    />
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

function FormError({ message }: { message: string }) {
  return message ? (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  ) : null;
}

function SubmitButton({
  isSubmitting,
  label
}: {
  isSubmitting: boolean;
  label: string;
}) {
  return (
    <div className="flex justify-end">
      <button
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Saving..." : label}
      </button>
    </div>
  );
}
