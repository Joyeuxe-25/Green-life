"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { changeAdminPassword } from "@/lib/admin-api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Current password, new password, and confirmation are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 12) {
      setError("New password must be at least 12 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changeAdminPassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      router.replace("/login");
    } catch (changeError) {
      setError(
        changeError instanceof Error
          ? changeError.message
          : "Password change failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <section className="w-full max-w-xl rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Account security
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Change Password</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          Updating your password will require signing in again after the API
          clears the current session cookie.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Current password
            <input
              autoComplete="current-password"
              className="w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isSubmitting}
              onChange={(event) => setCurrentPassword(event.target.value)}
              type="password"
              value={currentPassword}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            New password
            <input
              autoComplete="new-password"
              className="w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isSubmitting}
              onChange={(event) => setNewPassword(event.target.value)}
              type="password"
              value={newPassword}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Confirm new password
            <input
              autoComplete="new-password"
              className="w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isSubmitting}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              value={confirmPassword}
            />
          </label>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Updating password..." : "Change password"}
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
