"use client";

import { FormEvent, useState } from "react";
import type { StaffInput, StaffItem, StaffStatus } from "@/lib/admin-api";

type StaffFormProps = {
  initialStaff?: StaffItem;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (input: StaffInput) => Promise<void>;
};

const statusOptions: StaffStatus[] = ["active", "hidden"];

export function StaffForm({
  initialStaff,
  isSubmitting,
  onSubmit,
  submitLabel
}: StaffFormProps) {
  const [fullName, setFullName] = useState(initialStaff?.full_name ?? "");
  const [roleTitle, setRoleTitle] = useState(initialStaff?.role_title ?? "");
  const [shortBio, setShortBio] = useState(initialStaff?.short_bio ?? "");
  const [email, setEmail] = useState(initialStaff?.email ?? "");
  const [phone, setPhone] = useState(initialStaff?.phone ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    String(initialStaff?.display_order ?? 0)
  );
  const [status, setStatus] = useState<StaffStatus>(
    initialStaff?.status ?? "active"
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!fullName.trim() || !roleTitle.trim()) {
      setError("Full name and role title are required.");
      return;
    }

    await onSubmit({
      fullName: fullName.trim(),
      roleTitle: roleTitle.trim(),
      shortBio: shortBio.trim(),
      email: email.trim(),
      phone: phone.trim(),
      displayOrder: Number.parseInt(displayOrder, 10) || 0,
      status
    });
  }

  return (
    <form
      className="grid gap-5 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Full name" required>
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setFullName(event.target.value)}
            value={fullName}
          />
        </Field>

        <Field label="Role title" required>
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setRoleTitle(event.target.value)}
            value={roleTitle}
          />
        </Field>
      </div>

      <Field label="Short bio">
        <textarea
          className="min-h-32 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
          disabled={isSubmitting}
          onChange={(event) => setShortBio(event.target.value)}
          value={shortBio}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Email">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </Field>

        <Field label="Phone">
          <input
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
            disabled={isSubmitting}
            onChange={(event) => setPhone(event.target.value)}
            value={phone}
          />
        </Field>
      </div>

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
            onChange={(event) => setStatus(event.target.value as StaffStatus)}
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
