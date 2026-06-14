"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  deleteMedia,
  listMedia,
  updateMedia,
  uploadMedia,
  type MediaItem,
  type MediaStatus
} from "@/lib/admin-api";

const statusOptions: MediaStatus[] = ["active", "hidden"];

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [editingId, setEditingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    void loadMedia();
  }, []);

  async function loadMedia() {
    setError("");
    setIsLoading(true);
    try {
      const data = await listMedia();
      setMedia(data.media);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Could not load media."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Choose an image file to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const data = await uploadMedia({
        file,
        altText: altText.trim(),
        caption: caption.trim(),
        entityType: entityType.trim(),
        entityId: entityId.trim(),
        displayOrder: Number.parseInt(displayOrder, 10) || 0
      });
      setMedia((currentMedia) => [data.media, ...currentMedia]);
      setFile(null);
      setAltText("");
      setCaption("");
      setEntityType("");
      setEntityId("");
      setDisplayOrder("0");
      setSuccess("Media uploaded.");
      event.currentTarget.reset();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Could not upload media."
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleUpdate(item: MediaItem) {
    setEditingId(item.id);
    setError("");
    setSuccess("");
    try {
      const data = await updateMedia(item.id, {
        altText: item.alt_text ?? "",
        caption: item.caption ?? "",
        entityType: item.entity_type ?? "",
        entityId: item.entity_id ?? "",
        displayOrder: item.display_order,
        status: item.status
      });
      setMedia((currentMedia) =>
        currentMedia.map((mediaItem) =>
          mediaItem.id === item.id ? data.media : mediaItem
        )
      );
      setSuccess("Media metadata saved.");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update media metadata."
      );
    } finally {
      setEditingId("");
    }
  }

  async function handleDelete(item: MediaItem) {
    const confirmed = window.confirm(`Delete "${item.original_name}"?`);
    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setError("");
    setSuccess("");
    try {
      await deleteMedia(item.id);
      setMedia((currentMedia) =>
        currentMedia.filter((mediaItem) => mediaItem.id !== item.id)
      );
      setSuccess("Media deleted.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Could not delete media."
      );
    } finally {
      setDeletingId("");
    }
  }

  function updateItem(id: string, changes: Partial<MediaItem>) {
    setMedia((currentMedia) =>
      currentMedia.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  }

  async function copyUrl(url: string | null) {
    if (!url) {
      return;
    }

    await navigator.clipboard.writeText(url);
    setSuccess("Media URL copied.");
  }

  return (
    <AdminShell>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Media
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Media Library
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Upload and manage image assets for future content, news, events,
          projects, staff, partners, and site sections.
        </p>
      </section>

      <form
        className="mt-6 grid gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
        onSubmit={handleUpload}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Image file" required>
            <input
              accept="image/avif,image/jpeg,image/png,image/webp"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground focus:border-primary"
              disabled={isUploading}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </Field>
          <Field label="Display order">
            <input
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isUploading}
              onChange={(event) => setDisplayOrder(event.target.value)}
              type="number"
              value={displayOrder}
            />
          </Field>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Alt text">
            <input
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isUploading}
              onChange={(event) => setAltText(event.target.value)}
              value={altText}
            />
          </Field>
          <Field label="Caption">
            <input
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isUploading}
              onChange={(event) => setCaption(event.target.value)}
              value={caption}
            />
          </Field>
          <Field label="Entity type">
            <input
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isUploading}
              onChange={(event) => setEntityType(event.target.value)}
              value={entityType}
            />
          </Field>
          <Field label="Entity ID">
            <input
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isUploading}
              onChange={(event) => setEntityId(event.target.value)}
              value={entityId}
            />
          </Field>
        </div>

        {error ? <Alert tone="error" message={error} /> : null}
        {success ? <Alert tone="success" message={success} /> : null}

        <div className="flex justify-end">
          <button
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65"
            disabled={isUploading}
            type="submit"
          >
            {isUploading ? "Uploading..." : "Upload media"}
          </button>
        </div>
      </form>

      <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        {isLoading ? (
          <StateText text="Loading media library..." />
        ) : media.length === 0 ? (
          <StateText text="No media files yet." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {media.map((item) => (
              <article
                className="grid gap-4 rounded-lg border border-border bg-white p-4 shadow-sm"
                key={item.id}
              >
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-background">
                  {item.public_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={item.alt_text || item.original_name}
                      className="h-full w-full object-cover"
                      src={item.public_url}
                    />
                  ) : (
                    <div className="grid h-full place-items-center p-4 text-center text-sm text-muted-foreground">
                      Preview unavailable until a public media URL is configured.
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                      {item.original_name}
                    </h3>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold capitalize text-primary">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.mime_type} | {formatBytes(item.size_bytes)}
                  </p>
                </div>

                <div className="grid gap-3">
                  <Field label="Alt text">
                    <input
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
                      onChange={(event) =>
                        updateItem(item.id, { alt_text: event.target.value })
                      }
                      value={item.alt_text ?? ""}
                    />
                  </Field>
                  <Field label="Caption">
                    <input
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
                      onChange={(event) =>
                        updateItem(item.id, { caption: event.target.value })
                      }
                      value={item.caption ?? ""}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Entity type">
                      <input
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
                        onChange={(event) =>
                          updateItem(item.id, { entity_type: event.target.value })
                        }
                        value={item.entity_type ?? ""}
                      />
                    </Field>
                    <Field label="Entity ID">
                      <input
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
                        onChange={(event) =>
                          updateItem(item.id, { entity_id: event.target.value })
                        }
                        value={item.entity_id ?? ""}
                      />
                    </Field>
                    <Field label="Order">
                      <input
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
                        onChange={(event) =>
                          updateItem(item.id, {
                            display_order:
                              Number.parseInt(event.target.value, 10) || 0
                          })
                        }
                        type="number"
                        value={item.display_order}
                      />
                    </Field>
                    <Field label="Status">
                      <select
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
                        onChange={(event) =>
                          updateItem(item.id, {
                            status: event.target.value as MediaStatus
                          })
                        }
                        value={item.status}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-65"
                    disabled={editingId === item.id}
                    onClick={() => void handleUpdate(item)}
                    type="button"
                  >
                    {editingId === item.id ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-65"
                    disabled={!item.public_url}
                    onClick={() => void copyUrl(item.public_url)}
                    type="button"
                  >
                    Copy URL
                  </button>
                  <button
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-65"
                    disabled={deletingId === item.id}
                    onClick={() => void handleDelete(item)}
                    type="button"
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
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

function Alert({ message, tone }: { message: string; tone: "error" | "success" }) {
  const classes =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700";

  return <div className={`rounded-lg border p-3 text-sm ${classes}`}>{message}</div>;
}

function StateText({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) {
    return "Unknown size";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
