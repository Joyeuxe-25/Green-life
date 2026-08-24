"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { StaffForm } from "@/components/staff-form";
import { createStaffItem, replaceEntityImage, type StaffInput } from "@/lib/admin-api";

export default function AddStaffPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(input: StaffInput) {
    setError("");
    setIsSubmitting(true);
    try {
      const { imageFile, removeImage: _removeImage, ...payload } = input;
      const { staff } = await createStaffItem(payload);
      if (imageFile) {
        await replaceEntityImage("staff", staff.id, imageFile);
      }
      router.replace("/staff");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Could not create staff member."
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
            Staff
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Add Staff
          </h2>
        </div>
        <Link
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
          href="/staff"
        >
          Back to Staff
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <StaffForm
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel="Create staff member"
      />
    </AdminShell>
  );
}
