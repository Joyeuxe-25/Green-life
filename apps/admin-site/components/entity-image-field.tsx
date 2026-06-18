"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { resolveAdminMediaUrl } from "@/lib/admin-api";

const ACCEPTED_IMAGE_TYPES = ["image/avif", "image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

type EntityImageFieldProps = {
  currentImageUrl?: string | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
  onRemoveChange: (remove: boolean) => void;
  selectedFile: File | null;
  removeImage: boolean;
};

export function EntityImageField({
  currentImageUrl,
  disabled,
  onChange,
  onRemoveChange,
  removeImage,
  selectedFile
}: EntityImageFieldProps) {
  const [error, setError] = useState("");
  const previewUrl = useMemo(() => {
    if (!selectedFile) {
      return "";
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  const currentUrl = removeImage ? "" : resolveAdminMediaUrl(currentImageUrl);
  const visiblePreview = previewUrl || currentUrl;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError("");

    if (!file) {
      onChange(null);
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Use an AVIF, JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image must be 8 MB or smaller.");
      event.target.value = "";
      return;
    }

    onRemoveChange(false);
    onChange(file);
  }

  return (
    <div className="grid gap-3 rounded-xl border border-dashed border-border bg-muted/45 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Feature image</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Upload an AVIF, JPEG, PNG, or WebP image. Images are stored through the media library.
          </p>
        </div>
        {visiblePreview ? (
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
            disabled={disabled}
            onClick={() => {
              onChange(null);
              onRemoveChange(true);
            }}
            type="button"
          >
            <Trash2 aria-hidden="true" size={14} />
            Remove image
          </button>
        ) : null}
      </div>

      {visiblePreview ? (
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <img
            alt="Current feature preview"
            className="h-48 w-full object-cover"
            src={visiblePreview}
          />
        </div>
      ) : (
        <div className="grid min-h-32 place-items-center rounded-lg border border-border bg-white text-center text-sm text-muted-foreground">
          <div>
            <ImagePlus aria-hidden="true" className="mx-auto mb-2 text-primary" size={28} />
            No image selected
          </div>
        </div>
      )}

      <label className="inline-flex w-max cursor-pointer items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95">
        Choose image
        <input
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          disabled={disabled}
          onChange={handleFileChange}
          type="file"
        />
      </label>
      {selectedFile ? (
        <p className="text-xs font-medium text-muted-foreground">
          Selected: {selectedFile.name}
        </p>
      ) : null}
      {removeImage && currentImageUrl ? (
        <p className="text-xs font-medium text-red-700">
          The current image will be removed when you save.
        </p>
      ) : null}
      {error ? <p className="text-xs font-semibold text-red-700">{error}</p> : null}
    </div>
  );
}
