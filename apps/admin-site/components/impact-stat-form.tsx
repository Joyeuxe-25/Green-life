"use client";

import { FormEvent, useState } from "react";
import type { ImpactStatInput, ImpactStatItem, PublishStatus } from "@/lib/admin-api";

type ImpactStatFormProps = {
  initialStat?: ImpactStatItem;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (input: ImpactStatInput) => Promise<void>;
};

const statusOptions: PublishStatus[] = ["draft", "published"];

export function ImpactStatForm({
  initialStat,
  isSubmitting,
  onSubmit,
  submitLabel
}: ImpactStatFormProps) {
  const [label, setLabel] = useState(initialStat?.label ?? "");
  const [value, setValue] = useState(initialStat?.value ?? "");
  const [suffix, setSuffix] = useState(initialStat?.suffix ?? "");
  const [description, setDescription] = useState(initialStat?.description ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    String(initialStat?.display_order ?? 0)
  );
  const [status, setStatus] = useState<PublishStatus>(
    initialStat?.status ?? "draft"
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!label.trim() || !value.trim()) {
      setError("Label and value are required.");
      return;
    }

    await onSubmit({
      label: label.trim(),
      value: value.trim(),
      suffix: suffix.trim(),
      description: description.trim(),
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
        <Field label="Label" required>
          <Input disabled={isSubmitting} onChange={setLabel} value={label} />
        </Field>
        <Field label="Value" required>
          <Input disabled={isSubmitting} onChange={setValue} value={value} />
        </Field>
      </div>
      <Field label="Suffix">
        <Input disabled={isSubmitting} onChange={setSuffix} value={suffix} />
      </Field>
      <Field label="Description">
        <textarea
          className="min-h-28 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
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
