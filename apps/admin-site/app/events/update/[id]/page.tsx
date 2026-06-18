"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { EventForm } from "@/components/event-form";
import {
  getEventItem,
  removeEntityImages,
  replaceEntityImage,
  updateEventItem,
  type EventInput,
  type EventItem
} from "@/lib/admin-api";

export default function UpdateEventItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [eventItem, setEventItem] = useState<EventItem | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getEventItem(params.id)
      .then(({ event }) => {
        if (isMounted) {
          setEventItem(event);
          setIsLoading(false);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : "Could not load event."
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  async function handleSubmit(input: EventInput) {
    setError("");
    setIsSubmitting(true);
    try {
      const { imageFile, removeImage, ...payload } = input;
      const { event } = await updateEventItem(params.id, payload);
      if (imageFile) {
        await replaceEntityImage("event", event.id, imageFile);
      } else if (removeImage) {
        await removeEntityImages("event", event.id);
      }
      router.replace("/events");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update event."
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
            Update Event
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

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Loading event...
        </div>
      ) : null}

      {!isLoading && eventItem ? (
        <EventForm
          initialEvent={eventItem}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      ) : null}
    </AdminShell>
  );
}
