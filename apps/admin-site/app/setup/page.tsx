"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_LOGO_URL } from "@/lib/admin-brand-assets";
import { setupFirstAdmin } from "@/lib/admin-api";

export default function SetupPage() {
  const router = useRouter();
  const [setupKey, setSetupKey] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!setupKey.trim() || !name.trim() || !normalizedEmail || !password) {
      setError("Setup key, name, email, and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirmation do not match.");
      return;
    }

    if (password.length < 12 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError("Password must be at least 12 characters and include letters and numbers.");
      return;
    }

    setIsSubmitting(true);
    try {
      await setupFirstAdmin({
        setupKey: setupKey.trim(),
        name: name.trim(),
        email: normalizedEmail,
        password
      });
      setSuccess("First admin account created. Redirecting to login...");
      setTimeout(() => router.replace("/login"), 900);
    } catch (setupError) {
      setError(
        setupError instanceof Error
          ? setupError.message
          : "Setup failed. Check the setup key, API connection, and admin status."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-4 text-foreground sm:p-6">
      <section className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-lg shadow-slate-200/60 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-2xl border border-border bg-white p-2 shadow-sm">
            <img
              alt="Green for Life Rwanda"
              className="max-h-10 w-auto object-contain"
              src={ADMIN_LOGO_URL}
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              First admin setup
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Create Admin Account</h1>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-foreground/65">
          This setup works only while the API setup window is enabled and only
          when no admin account exists.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Setup key
            <input
              autoComplete="off"
              className="w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isSubmitting}
              onChange={(event) => setSetupKey(event.target.value)}
              type="password"
              value={setupKey}
            />
          </label>

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
            Password
            <input
              autoComplete="new-password"
              className="w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isSubmitting}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Confirm password
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

          {success ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              {success}
            </div>
          ) : null}

          <button
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-65"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating admin..." : "Create first admin"}
          </button>
        </form>
      </section>
    </main>
  );
}
