"use client";

import { FormEvent, useState } from "react";
import type { NewsInput, NewsItem, NewsStatus } from "@/lib/admin-api";

type NewsFormProps = {
  initialNews?: NewsItem;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (input: NewsInput) => Promise<void>;
};

const statusOptions: NewsStatus[] = ["draft", "published", "archived"];

export function NewsForm({
  initialNews,
  isSubmitting,
  onSubmit,
  submitLabel
}: NewsFormProps) {
  const [title, setTitle] = useState(initialNews?.title ?? "");
  const [slug, setSlug] = useState(initialNews?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialNews?.excerpt ?? "");
  const [content, setContent] = useState(initialNews?.content ?? "");
  const [category, setCategory] = useState(initialNews?.category ?? "");
  const [publishedAt, setPublishedAt] = useState(
    toDateTimeLocalValue(initialNews?.published_at)
  );
  const [status, setStatus] = useState<NewsStatus>(initialNews?.status ?? "draft");
  const [seoTitle, setSeoTitle] = useState(initialNews?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    initialNews?.seo_description ?? ""
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError("Title, excerpt, and content are required.");
      return;
    }

    await onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category.trim(),
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : "",
      status,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim()
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

      <Field label="Excerpt" required>
        <textarea
          className="min-h-24 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setExcerpt(event.target.value)}
          value={excerpt}
        />
      </Field>

      <Field label="Content" required>
        <textarea
          className="min-h-56 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setContent(event.target.value)}
          value={content}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Status">
          <select
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setStatus(event.target.value as NewsStatus)}
            value={status}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Published date">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setPublishedAt(event.target.value)}
            type="datetime-local"
            value={publishedAt}
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="SEO title">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setSeoTitle(event.target.value)}
            value={seoTitle}
          />
        </Field>

        <Field label="SEO description">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setSeoDescription(event.target.value)}
            value={seoDescription}
          />
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

function toDateTimeLocalValue(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
}
