export const CONTENT_MODULES = [
  "news",
  "events",
  "projects",
  "staff",
  "partners",
  "media",
  "contact_messages",
  "donation_messages"
] as const;

export const MEDIA_ENTITY_TYPES = [
  "news",
  "event",
  "project",
  "staff",
  "partner"
] as const;

export const PUBLICATION_STATUSES = ["draft", "published", "archived"] as const;

export const MESSAGE_STATUSES = [
  "new",
  "read",
  "replied",
  "archived"
] as const;

export const PROJECT_STATUSES = ["planned", "active", "completed"] as const;

export const EVENT_STATUSES = [
  "draft",
  "upcoming",
  "completed",
  "cancelled"
] as const;

export const VISIBILITY_STATUSES = ["active", "hidden"] as const;

export const ADMIN_MANAGED_MODULES = [
  "news",
  "events",
  "projects",
  "staff",
  "partners",
  "contact_messages",
  "donation_messages"
] as const;

export const PUBLIC_NAVIGATION_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Projects", href: "/projects" },
  { label: "Impact", href: "/impact" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Staff", href: "/staff" },
  { label: "Partners", href: "/partners" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
  { label: "Get Involved", href: "/get-involved" }
] as const;

export const ADMIN_NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/dashboard", module: "dashboard" },
  { label: "News", href: "/news", module: "news" },
  { label: "Events", href: "/events", module: "events" },
  { label: "Projects", href: "/projects", module: "projects" },
  { label: "Staff", href: "/staff", module: "staff" },
  { label: "Partners", href: "/partners", module: "partners" },
  {
    label: "Contact Messages",
    href: "/contact-messages",
    module: "contact_messages"
  },
  {
    label: "Donation Messages",
    href: "/donation-messages",
    module: "donation_messages"
  }
] as const;
