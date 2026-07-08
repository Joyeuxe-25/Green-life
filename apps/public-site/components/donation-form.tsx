"use client";

import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import { HandHeart, HeartHandshake, Sprout } from "lucide-react";
import { submitDonationMessage } from "@/lib/public-api";

type FormState = "idle" | "loading" | "success" | "error";

export function DonationForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      await submitDonationMessage({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        donation_interest: String(formData.get("donation_interest") || ""),
        message: String(formData.get("message") || "")
      });
      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Donation inquiry could not be sent.");
    }
  }

  return (
    <section className="section contact-layout-section">
      <div className="container contact-layout">
        <aside className="contact-details reveal-card">
          <p className="eyebrow">Ways to support</p>
          <h2>Start a support conversation</h2>
          <div className="support-list">
            <SupportItem icon={<Sprout size={20} />} label="Tree planting and nurseries" />
            <SupportItem icon={<HeartHandshake size={20} />} label="Farmer training and community work" />
            <SupportItem icon={<HandHeart size={20} />} label="School greening and youth action" />
          </div>
        </aside>

        <form className="public-form reveal-card" onSubmit={onSubmit}>
          <div>
            <p className="eyebrow">Donation inquiry</p>
            <h2>Send support details</h2>
          </div>
          <label>
            Name
            <input name="name" required type="text" />
          </label>
          <label>
            Email
            <input name="email" required type="email" />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" />
          </label>
          <label>
            Donation interest
            <input name="donation_interest" type="text" />
          </label>
          <label>
            Message
            <textarea name="message" required rows={5} />
          </label>
          <button className="button primary" disabled={status === "loading"} type="submit">
            {status === "loading" ? "Sending..." : "Send inquiry"}
          </button>
          {status === "success" ? <p className="form-status success">Your inquiry was sent.</p> : null}
          {status === "error" ? <p className="form-status error">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}

function SupportItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="support-item">
      <span className="detail-icon" aria-hidden="true">
        {icon}
      </span>
      <strong>{label}</strong>
    </div>
  );
}
