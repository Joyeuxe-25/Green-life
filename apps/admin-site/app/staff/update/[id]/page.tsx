"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { StaffForm } from "@/components/staff-form";
import {
  getStaffItem,
  removeEntityImages,
  replaceEntityImage,
  updateStaffItem,
  type StaffInput,
  type StaffItem
} from "@/lib/admin-api";

export default function UpdateStaffItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [staffMember, setStaffMember] = useState<StaffItem | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getStaffItem(params.id)
      .then(({ staff }) => {
        if (isMounted) {
          setStaffMember(staff);
          setIsLoading(false);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load staff member."
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  async function handleSubmit(input: StaffInput) {
    setError("");
    setIsSubmitting(true);
    try {
      const { imageFile, removeImage, ...payload } = input;
      const { staff } = await updateStaffItem(params.id, payload);
      if (imageFile) {
        await replaceEntityImage("staff", staff.id, imageFile);
      } else if (removeImage) {
        await removeEntityImages("staff", staff.id);
      }
      router.replace("/staff");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update staff member."
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
            Update Staff
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

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Loading staff member...
        </div>
      ) : null}

      {!isLoading && staffMember ? (
        <StaffForm
          initialStaff={staffMember}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      ) : null}
    </AdminShell>
  );
}
