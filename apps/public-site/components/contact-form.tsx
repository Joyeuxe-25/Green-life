"use client";

import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { submitContactMessage, type SiteSetting } from "@/lib/public-api";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm({ siteSettings }: { siteSettings: SiteSetting[] }) {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const email = getSetting(siteSettings, "contact.email") || getSetting(siteSettings, "site.email");
  const phone = getSetting(siteSettings, "contact.phone") || getSetting(siteSettings, "site.phone");
  const location =
    getSetting(siteSettings, "contact.location") ||
    getSetting(siteSettings, "contact.address") ||
    getSetting(siteSettings, "site.address");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      await submitContactMessage({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        subject: String(formData.get("subject") || ""),
        message: String(formData.get("message") || "")
      });
      form.reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Message could not be sent.");
    }
  }

  return (
    <section className="section contact-layout-section">
      <div className="container contact-layout">
        <aside className="contact-details reveal-card">
          <p className="eyebrow">Contact details</p>
          <h2>Reach the team</h2>
          <div className="contact-detail-list">
            {email ? <ContactDetail icon={<Mail size={19} />} label="Email" value={email} /> : null}
            {phone ? <ContactDetail icon={<Phone size={19} />} label="Phone" value={phone} /> : null}
            {location ? <ContactDetail icon={<MapPin size={19} />} label="Location" value={location} /> : null}
          </div>
        </aside>

        <form className="public-form reveal-card" onSubmit={onSubmit}>
          <div>
            <p className="eyebrow">Message</p>
            <h2>Send a note</h2>
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
            Subject
            <input name="subject" type="text" />
          </label>
          <label>
            Message
            <textarea name="message" required rows={5} />
          </label>
          <button className="button primary" disabled={status === "loading"} type="submit">
            {status === "loading" ? "Sending..." : "Send message"}
          </button>
          {status === "success" ? <p className="form-status success">Your message was sent.</p> : null}
          {status === "error" ? <p className="form-status error">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}

function getSetting(settings: SiteSetting[], key: string) {
  return settings.find((setting) => setting.key === key)?.value ?? "";
}

function ContactDetail({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="contact-detail">
      <span className="detail-icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <strong>{label}</strong>
        <p>{value}</p>
      </div>
    </div>
  );
}
