"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import {
  getCurrentAdmin,
  updateAccountSettings,
  type AdminUser
} from "@/lib/admin-api";

export default function AccountPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCurrentAdmin()
      .then(({ admin: currentAdmin }) => {
        if (!isMounted) {
          return;
        }

        setAdmin(currentAdmin);
        setName(currentAdmin.name);
        setEmail(currentAdmin.email);
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          router.replace("/login");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();
    const passwordChangeRequested = Boolean(newPassword || confirmPassword);

    if (!name.trim() || !normalizedEmail || !currentPassword) {
      setError("Name, email, and current password are required.");
      return;
    }

    if (passwordChangeRequested) {
      if (newPassword !== confirmPassword) {
        setError("New password and confirmation do not match.");
        return;
      }

      if (
        newPassword.length < 12 ||
        !/[A-Za-z]/.test(newPassword) ||
        !/\d/.test(newPassword)
      ) {
        setError("New password must be at least 12 characters and include letters and numbers.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await updateAccountSettings({
        name: name.trim(),
        email: normalizedEmail,
        currentPassword,
        newPassword: passwordChangeRequested ? newPassword : undefined,
        confirmPassword: passwordChangeRequested ? confirmPassword : undefined
      });

      if (result.requiresLogin) {
        setSuccess("Account updated. Please sign in again with the new details.");
        setTimeout(() => router.replace("/login"), 900);
        return;
      }

      setAdmin(result.admin);
      setName(result.admin.name);
      setEmail(result.admin.email);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Account details updated.");
      router.refresh();
    } catch (accountError) {
      setError(
        accountError instanceof Error
          ? accountError.message
          : "Account update failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <section className="w-full max-w-2xl rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Admin profile
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Account Settings</h2>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          Update the handover admin name, email, or password. Your current
          password is required for every change.
        </p>

        {isLoading ? (
          <div className="mt-6 rounded-md border border-border bg-background p-4 text-sm text-foreground/70">
            Loading account details...
          </div>
        ) : (
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Admin name
              <input
                autoComplete="name"
                className="w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
                disabled={isSubmitting}
                onChange={(event) => setName(event.target.value)}
                type="text"
                value={name}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Admin email
              <input
                autoComplete="email"
                className="w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
                disabled={isSubmitting}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
            </label>

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

            <div className="grid gap-4 rounded-lg border border-border bg-background p-4">
              <div>
                <h3 className="font-semibold">Optional password change</h3>
                <p className="mt-1 text-sm text-foreground/65">
                  Leave these fields blank to keep the current password.
                </p>
              </div>

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
            </div>

            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                {success}
              </div>
            ) : null}

            <button
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65"
              disabled={isSubmitting || !admin}
              type="submit"
            >
              {isSubmitting ? "Saving account..." : "Save account settings"}
            </button>
          </form>
        )}
      </section>
    </AdminShell>
  );
}
