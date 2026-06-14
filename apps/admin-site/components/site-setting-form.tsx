"use client";

import { FormEvent, useState } from "react";
import type { SiteSettingInput, SiteSettingItem } from "@/lib/admin-api";

type SiteSettingFormProps = {
  initialSetting?: SiteSettingItem;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (input: SiteSettingInput) => Promise<void>;
};

export function SiteSettingForm({
  initialSetting,
  isSubmitting,
  onSubmit,
  submitLabel
}: SiteSettingFormProps) {
  const [key, setKey] = useState(initialSetting?.key ?? "");
  const [groupKey, setGroupKey] = useState(
    initialSetting?.group_key ?? "general"
  );
  const [label, setLabel] = useState(initialSetting?.label ?? "");
  const [value, setValue] = useState(initialSetting?.value ?? "");
  const [fieldType, setFieldType] = useState(
    initialSetting?.field_type ?? "text"
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!key.trim() || !label.trim()) {
      setError("Key and label are required.");
      return;
    }

    await onSubmit({
      key: key.trim(),
      groupKey: groupKey.trim(),
      label: label.trim(),
      value: value.trim(),
      fieldType: fieldType.trim()
    });
  }

  return (
    <form
      className="grid gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Key" required>
          <Input disabled={isSubmitting} onChange={setKey} value={key} />
        </Field>
        <Field label="Group key">
          <Input disabled={isSubmitting} onChange={setGroupKey} value={groupKey} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Label" required>
          <Input disabled={isSubmitting} onChange={setLabel} value={label} />
        </Field>
        <Field label="Field type">
          <Input disabled={isSubmitting} onChange={setFieldType} value={fieldType} />
        </Field>
      </div>
      <Field label="Value">
        <textarea
          className="min-h-36 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setValue(event.target.value)}
          value={value}
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
