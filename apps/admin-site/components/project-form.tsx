"use client";

import { FormEvent, useState } from "react";
import type { ProjectInput, ProjectItem, ProjectStatus } from "@/lib/admin-api";

type ProjectFormProps = {
  initialProject?: ProjectItem;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (input: ProjectInput) => Promise<void>;
};

const statusOptions: ProjectStatus[] = ["planned", "active", "completed"];

export function ProjectForm({
  initialProject,
  isSubmitting,
  onSubmit,
  submitLabel
}: ProjectFormProps) {
  const [title, setTitle] = useState(initialProject?.title ?? "");
  const [slug, setSlug] = useState(initialProject?.slug ?? "");
  const [summary, setSummary] = useState(initialProject?.summary ?? "");
  const [description, setDescription] = useState(initialProject?.description ?? "");
  const [district, setDistrict] = useState(initialProject?.district ?? "");
  const [sector, setSector] = useState(initialProject?.sector ?? "");
  const [startDate, setStartDate] = useState(toDateInputValue(initialProject?.start_date));
  const [endDate, setEndDate] = useState(toDateInputValue(initialProject?.end_date));
  const [status, setStatus] = useState<ProjectStatus>(
    initialProject?.status ?? "planned"
  );
  const [category, setCategory] = useState(initialProject?.category ?? "");
  const [impactSummary, setImpactSummary] = useState(
    initialProject?.impact_summary ?? ""
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !summary.trim() || !description.trim()) {
      setError("Title, summary, and description are required.");
      return;
    }

    if (startDate && endDate && endDate < startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    await onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      summary: summary.trim(),
      description: description.trim(),
      district: district.trim(),
      sector: sector.trim(),
      startDate,
      endDate,
      status,
      category: category.trim(),
      impactSummary: impactSummary.trim()
    });
  }

  return (
    <form
      className="grid gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Title" required>
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </Field>

        <Field label="Slug">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="Generated from title if blank"
            value={slug}
          />
        </Field>
      </div>

      <Field label="Summary" required>
        <textarea
          className="min-h-24 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setSummary(event.target.value)}
          value={summary}
        />
      </Field>

      <Field label="Description" required>
        <textarea
          className="min-h-56 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Status">
          <select
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setStatus(event.target.value as ProjectStatus)}
            value={status}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Start date">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setStartDate(event.target.value)}
            type="date"
            value={startDate}
          />
        </Field>

        <Field label="End date">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setEndDate(event.target.value)}
            type="date"
            value={endDate}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="District">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setDistrict(event.target.value)}
            value={district}
          />
        </Field>

        <Field label="Sector">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setSector(event.target.value)}
            value={sector}
          />
        </Field>

        <Field label="Category">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          />
        </Field>
      </div>

      <Field label="Impact summary">
        <textarea
          className="min-h-28 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setImpactSummary(event.target.value)}
          value={impactSummary}
        />
      </Field>

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

function toDateInputValue(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}
