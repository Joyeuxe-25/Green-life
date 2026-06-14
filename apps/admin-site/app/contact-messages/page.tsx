"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  deleteContactMessage,
  listContactMessages,
  markContactMessageRead,
  markContactMessageUnread,
  type ContactMessageItem
} from "@/lib/admin-api";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [expandedId, setExpandedId] = useState("");
  const [busyId, setBusyId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listContactMessages()
      .then((data) => setMessages(data.messages))
      .catch((loadError) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load contact messages."
        )
      )
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(message: ContactMessageItem) {
    const confirmed = window.confirm(
      `Delete message from "${message.sender_name}"?`
    );
    if (!confirmed) {
      return;
    }

    setBusyId(message.id);
    setError("");
    try {
      await deleteContactMessage(message.id);
      setMessages((currentMessages) =>
        currentMessages.filter((item) => item.id !== message.id)
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete contact message."
      );
    } finally {
      setBusyId("");
    }
  }

  async function handleReadToggle(message: ContactMessageItem) {
    setBusyId(message.id);
    setError("");
    try {
      const data =
        message.status === "read"
          ? await markContactMessageUnread(message.id)
          : await markContactMessageRead(message.id);
      setMessages((currentMessages) =>
        currentMessages.map((item) =>
          item.id === message.id ? data.message : item
        )
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update message status."
      );
    } finally {
      setBusyId("");
    }
  }

  return (
    <AdminShell>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Inbox
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Contact Messages
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Review contact form submissions. Reply and email sending are outside
          this phase.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
            Loading contact messages...
          </div>
        ) : null}

        {!isLoading && messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
            No contact messages yet.
          </div>
        ) : null}

        {!isLoading && messages.length > 0 ? (
          <div className="grid gap-3">
            {messages.map((message) => {
              const isExpanded = expandedId === message.id;

              return (
                <article
                  className="rounded-lg border border-border bg-white p-4 shadow-sm"
                  key={message.id}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {message.sender_name}
                        </h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold capitalize text-primary">
                          {message.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {[message.email, message.phone].filter(Boolean).join(" | ")}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {message.subject || "No subject"}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {message.message}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
                        onClick={() =>
                          setExpandedId(isExpanded ? "" : message.id)
                        }
                        type="button"
                      >
                        {isExpanded ? "Hide" : "View"}
                      </button>
                      <button
                        className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-65"
                        disabled={busyId === message.id}
                        onClick={() => void handleReadToggle(message)}
                        type="button"
                      >
                        {message.status === "read" ? "Mark unread" : "Mark read"}
                      </button>
                      <button
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-65"
                        disabled={busyId === message.id}
                        onClick={() => void handleDelete(message)}
                        type="button"
                      >
                        {busyId === message.id ? "Working..." : "Delete"}
                      </button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 rounded-lg border border-border bg-background p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                        {message.message}
                      </p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}
