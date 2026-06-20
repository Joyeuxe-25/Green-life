"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { KeyRound, LogOut, UserCircle } from "lucide-react";
import type { AdminUser } from "@/lib/admin-api";

type AdminProfileMenuProps = {
  admin: AdminUser;
  align?: "left" | "right";
  compact?: boolean;
  onLogout: () => void;
  onNavigate?: () => void;
  placement?: "down" | "up";
};

export function AdminProfileMenu({
  admin,
  align = "right",
  compact,
  onLogout,
  onNavigate,
  placement = "down"
}: AdminProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const displayName = admin.name || admin.email;
  const role = admin.role || "Administrator";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={
          compact
            ? "grid size-11 place-items-center rounded-xl border border-border bg-background text-primary shadow-sm transition hover:border-primary"
            : "inline-flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 text-left shadow-sm transition hover:border-primary"
        }
        onClick={() => setIsOpen((current) => !current)}
        title="Profile menu"
        type="button"
      >
        <UserCircle aria-hidden="true" className="shrink-0 text-primary" size={22} />
        {!compact ? (
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">
              {displayName}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{role}</span>
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          className={`absolute z-50 w-72 rounded-xl border border-border bg-card p-3 text-sm shadow-xl shadow-slate-200/70 ${
            placement === "up" ? "bottom-full mb-2" : "top-full mt-2"
          } ${
            align === "left" ? "left-0" : "right-0"
          }`}
          role="menu"
        >
          <div className="rounded-lg bg-background p-3">
            <p className="truncate font-semibold text-foreground">{displayName}</p>
            <p className="mt-1 break-all text-xs text-muted-foreground">{admin.email}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
              {role}
            </p>
          </div>
          <div className="mt-2 grid gap-1">
            <Link
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-foreground transition hover:bg-background hover:text-primary"
              href="/account"
              onClick={() => {
                setIsOpen(false);
                onNavigate?.();
              }}
              role="menuitem"
            >
              <KeyRound aria-hidden="true" size={17} />
              Account Settings
            </Link>
            <button
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold text-foreground transition hover:bg-background hover:text-primary"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              role="menuitem"
              type="button"
            >
              <LogOut aria-hidden="true" size={17} />
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
