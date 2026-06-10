"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { EventForm } from "@/components/event-form";
import { createEventItem, type EventInput } from "@/lib/admin-api";

export default function AddEventPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(input: EventInput) {
    setError("");
    setIsSubmitting(true);
    try {
      await createEventItem(input);
      router.replace("/events");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Could not create event."
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
            Events
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Add Event
          </h2>
        </div>
        <Link
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
          href="/events"
        >
          Back to Events
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <EventForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel="Create event"
      />
    </AdminShell>
  );
}
