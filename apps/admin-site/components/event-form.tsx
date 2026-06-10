"use client";

import { FormEvent, useState } from "react";
import type { EventInput, EventItem, EventStatus } from "@/lib/admin-api";

type EventFormProps = {
  initialEvent?: EventItem;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (input: EventInput) => Promise<void>;
};

const statusOptions: EventStatus[] = [
  "draft",
  "upcoming",
  "completed",
  "cancelled"
];

export function EventForm({
  initialEvent,
  isSubmitting,
  onSubmit,
  submitLabel
}: EventFormProps) {
  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [slug, setSlug] = useState(initialEvent?.slug ?? "");
  const [description, setDescription] = useState(initialEvent?.description ?? "");
  const [eventDate, setEventDate] = useState(
    toDateTimeLocalValue(initialEvent?.event_date)
  );
  const [startTime, setStartTime] = useState(initialEvent?.start_time ?? "");
  const [endTime, setEndTime] = useState(initialEvent?.end_time ?? "");
  const [location, setLocation] = useState(initialEvent?.location ?? "");
  const [category, setCategory] = useState(initialEvent?.category ?? "");
  const [status, setStatus] = useState<EventStatus>(
    initialEvent?.status ?? "draft"
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !eventDate) {
      setError("Title, description, and event date are required.");
      return;
    }

    await onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      eventDate: new Date(eventDate).toISOString(),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      location: location.trim(),
      category: category.trim(),
      status
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

      <Field label="Description" required>
        <textarea
          className="min-h-40 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Field label="Event date" required>
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setEventDate(event.target.value)}
            type="datetime-local"
            value={eventDate}
          />
        </Field>

        <Field label="Start time">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setStartTime(event.target.value)}
            type="time"
            value={startTime}
          />
        </Field>

        <Field label="End time">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setEndTime(event.target.value)}
            type="time"
            value={endTime}
          />
        </Field>

        <Field label="Status">
          <select
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setStatus(event.target.value as EventStatus)}
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Location">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setLocation(event.target.value)}
            value={location}
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
