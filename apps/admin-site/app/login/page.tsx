"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_LOGO_URL } from "@/lib/admin-brand-assets";
import { loginAdmin } from "@/lib/admin-api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await loginAdmin({
        email: email.trim(),
        password
      });
      router.replace("/dashboard");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login failed. Please check your credentials."
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
              Admin access
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Green for Life Rwanda Admin</h1>
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
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
              autoComplete="current-password"
              className="w-full min-w-0 rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-primary"
              disabled={isSubmitting}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
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
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
