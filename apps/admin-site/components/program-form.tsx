"use client";

import { FormEvent, useState } from "react";
import type {
  ProgramContentInput,
  ProgramContentItem,
  PublishStatus
} from "@/lib/admin-api";

type ProgramFormProps = {
  initialProgram?: ProgramContentItem;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (input: ProgramContentInput) => Promise<void>;
};

const statusOptions: PublishStatus[] = ["draft", "published"];

export function ProgramForm({
  initialProgram,
  isSubmitting,
  onSubmit,
  submitLabel
}: ProgramFormProps) {
  const [title, setTitle] = useState(initialProgram?.title ?? "");
  const [slug, setSlug] = useState(initialProgram?.slug ?? "");
  const [summary, setSummary] = useState(initialProgram?.summary ?? "");
  const [body, setBody] = useState(initialProgram?.body ?? "");
  const [iconName, setIconName] = useState(initialProgram?.icon_name ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    String(initialProgram?.display_order ?? 0)
  );
  const [status, setStatus] = useState<PublishStatus>(
    initialProgram?.status ?? "draft"
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    await onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      summary: summary.trim(),
      body: body.trim(),
      iconName: iconName.trim(),
      displayOrder: Number.parseInt(displayOrder, 10) || 0,
      status
    });
  }

  return (
    <form
      className="grid gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" required>
          <Input disabled={isSubmitting} onChange={setTitle} value={title} />
        </Field>
        <Field label="Slug">
          <Input disabled={isSubmitting} onChange={setSlug} value={slug} />
        </Field>
      </div>
      <Field label="Summary">
        <textarea
          className="min-h-28 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setSummary(event.target.value)}
          value={summary}
        />
      </Field>
      <Field label="Body">
        <textarea
          className="min-h-48 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setBody(event.target.value)}
          value={body}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Icon name">
          <Input disabled={isSubmitting} onChange={setIconName} value={iconName} />
        </Field>
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
