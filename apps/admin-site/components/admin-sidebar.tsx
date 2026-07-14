"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderKanban,
  Handshake,
  Images,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Settings,
  Sprout,
  UsersRound,
  X
} from "lucide-react";
import { AdminProfileMenu } from "@/components/admin-profile-menu";
import { ADMIN_LOGO_URL } from "@/lib/admin-brand-assets";
import type { AdminUser } from "@/lib/admin-api";

type SidebarChild = {
  label: string;
  href: string;
};

type SidebarItem = {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
  children?: SidebarChild[];
};

const actionChildren = (base: string): SidebarChild[] => [
  { label: "Update", href: `/${base}/update` },
  { label: "Add New", href: `/${base}/add` }
];

const primaryItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Newspaper, label: "News", href: "/news", children: actionChildren("news") },
  { icon: FileText, label: "Events", href: "/events", children: actionChildren("events") },
  {
    icon: FolderKanban,
    label: "Projects",
    href: "/projects",
    children: actionChildren("projects")
  },
  { icon: UsersRound, label: "Staff", href: "/staff", children: actionChildren("staff") },
  {
    icon: Handshake,
    label: "Partners",
    href: "/partners",
    children: actionChildren("partners")
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/contact-messages",
    children: [
      { label: "Contact", href: "/contact-messages" },
      { label: "Donations", href: "/donation-messages" }
    ]
  },
  { icon: Images, label: "Media Library", href: "/media" },
  {
    icon: FileText,
    label: "Site Content",
    href: "/site-content",
    children: actionChildren("site-content")
  },
  {
    icon: Sprout,
    label: "Programs",
    href: "/programs",
    children: actionChildren("programs")
  },
  {
    icon: BarChart3,
    label: "Impact Stats",
    href: "/impact-stats",
    children: actionChildren("impact-stats")
  },
  {
    icon: Settings,
    label: "Site Settings",
    href: "/site-settings",
    children: actionChildren("site-settings")
  }
];

type AdminSidebarProps = {
  admin: AdminUser;
  isCollapsed?: boolean;
  onClose?: () => void;
  onCollapseToggle?: () => void;
  onLogout: () => void;
  onNavigate?: () => void;
};

export function AdminSidebar({
  admin,
  isCollapsed = false,
  onClose,
  onCollapseToggle,
  onLogout,
  onNavigate
}: AdminSidebarProps) {
  const pathname = usePathname();
  const initialOpenGroups = useMemo(() => {
    return primaryItems
      .filter((item) => item.children && isItemActive(pathname, item))
      .map((item) => item.href);
  }, [pathname]);
  const [openGroups, setOpenGroups] = useState<string[]>(initialOpenGroups);

  function toggleGroup(href: string) {
    setOpenGroups((current) =>
      current.includes(href)
        ? current.filter((item) => item !== href)
        : [...current, href]
    );
  }

  return (
    <aside
      className={`flex h-full min-h-screen flex-col border-r border-border bg-card shadow-xl transition-[width] duration-200 lg:sticky lg:top-0 lg:shadow-sm ${
        isCollapsed ? "w-[5.5rem] p-3" : "w-full p-4 sm:p-5 lg:w-72"
      }`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          className={`flex min-w-0 items-center gap-3 rounded-xl bg-primary text-primary-foreground shadow-sm transition hover:brightness-105 ${
            isCollapsed ? "justify-center p-2" : "flex-1 px-3 py-3"
          }`}
          href="/dashboard"
          onClick={onNavigate}
          title="Green for Life Rwanda Admin"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white p-1.5">
            <img
              alt="Green for Life Rwanda"
              className="max-h-8 w-auto object-contain"
              src={ADMIN_LOGO_URL}
            />
          </span>
          {!isCollapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold uppercase tracking-wide">
                Green for Life Rwanda
              </span>
              <span className="mt-0.5 block truncate text-base font-bold">
                GLR Admin
              </span>
            </span>
          ) : null}
        </Link>
        {onClose ? (
          <button
            aria-label="Close admin menu"
            className="grid size-10 place-items-center rounded-lg border border-border text-foreground lg:hidden"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        ) : null}
      </div>

      {onCollapseToggle ? (
        <button
          className="mb-4 hidden min-h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary lg:inline-flex"
          onClick={onCollapseToggle}
          type="button"
        >
          {isCollapsed ? (
            <ChevronRight aria-hidden="true" size={18} />
          ) : (
            <ChevronLeft aria-hidden="true" size={18} />
          )}
          {!isCollapsed ? "Collapse" : null}
        </button>
      ) : null}

      <nav aria-label="Admin navigation" className="min-h-0 flex-1 overflow-y-auto">
        <ul className="flex list-none flex-col gap-1 p-0 text-sm">
          {primaryItems.map((item) => (
            <SidebarNavItem
              isCollapsed={isCollapsed}
              isOpen={openGroups.includes(item.href)}
              isActive={isItemActive(pathname, item)}
              item={item}
              key={item.href}
              onNavigate={onNavigate}
              onToggle={() => toggleGroup(item.href)}
              pathname={pathname}
            />
          ))}
        </ul>
      </nav>

      <div className="mt-4 border-t border-border pt-4">
        <AdminProfileMenu
          admin={admin}
          align={isCollapsed ? "left" : "right"}
          compact={isCollapsed}
          onLogout={onLogout}
          onNavigate={onNavigate}
          placement="up"
        />
      </div>
    </aside>
  );
}

function SidebarNavItem({
  isActive,
  isCollapsed,
  isOpen,
  item,
  onNavigate,
  onToggle,
  pathname
}: {
  isActive: boolean;
  isCollapsed: boolean;
  isOpen: boolean;
  item: SidebarItem;
  onNavigate?: () => void;
  onToggle: () => void;
  pathname: string;
}) {
  const Icon = item.icon;
  const baseClasses =
    "group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 font-semibold transition";
  const activeClasses = isActive
    ? "bg-primary text-primary-foreground shadow-sm"
    : "text-foreground hover:bg-background hover:text-primary";

  if (!item.children) {
    return (
      <li>
        <Link
          className={`${baseClasses} ${activeClasses} ${
            isCollapsed ? "justify-center" : ""
          }`}
          href={item.href}
          onClick={onNavigate}
          title={item.label}
        >
          <Icon aria-hidden="true" size={19} />
          {!isCollapsed ? <span>{item.label}</span> : null}
        </Link>
      </li>
    );
  }

  return (
    <li className="relative">
      <button
        aria-expanded={isOpen}
        className={`${baseClasses} ${activeClasses} ${
          isCollapsed ? "justify-center" : ""
        }`}
        onClick={onToggle}
        title={item.label}
        type="button"
      >
        <Icon aria-hidden="true" size={19} />
        {!isCollapsed ? (
          <>
            <span className="min-w-0 flex-1 text-left">{item.label}</span>
            <ChevronDown
              aria-hidden="true"
              className={`transition ${isOpen ? "rotate-180" : ""}`}
              size={16}
            />
          </>
        ) : null}
      </button>
      {isOpen ? (
        <ul
          className={
            isCollapsed
              ? "absolute left-full top-0 z-40 ml-2 min-w-40 rounded-xl border border-border bg-card p-2 shadow-xl"
              : "mb-2 ml-5 mt-1 flex list-none flex-col gap-1 border-l border-border pl-3"
          }
        >
          {item.children.map((child) => {
            const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);

            return (
              <li key={child.href}>
                <Link
                  className={`block rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    childActive
                      ? "bg-background text-primary"
                      : "text-muted-foreground hover:bg-background hover:text-primary"
                  }`}
                  href={child.href}
                  onClick={onNavigate}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}

function isItemActive(pathname: string, item: SidebarItem) {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
