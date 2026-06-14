export type AdminUser = {
  id: string;
  name: string;
  email: string;
};

type ApiEnvelope<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error?: {
        message?: string;
        details?: Record<string, unknown>;
      };
    };

type LoginInput = {
  email: string;
  password: string;
};

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type NewsStatus = "draft" | "published" | "archived";

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string | null;
  published_at: string | null;
  status: NewsStatus;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type NewsInput = {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category?: string;
  publishedAt?: string;
  status: NewsStatus;
  seoTitle?: string;
  seoDescription?: string;
};

export type EventStatus = "draft" | "upcoming" | "completed" | "cancelled";

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  category: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type EventInput = {
  title: string;
  slug?: string;
  description: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
  status: EventStatus;
};

export type ProjectStatus = "planned" | "active" | "completed";

export type ProjectItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  district: string | null;
  sector: string | null;
  start_date: string | null;
  end_date: string | null;
  status: ProjectStatus;
  category: string | null;
  impact_summary: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ProjectInput = {
  title: string;
  slug?: string;
  summary: string;
  description: string;
  district?: string;
  sector?: string;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  category?: string;
  impactSummary?: string;
};

export type StaffStatus = "active" | "hidden";

export type StaffItem = {
  id: string;
  full_name: string;
  role_title: string;
  short_bio: string | null;
  email: string | null;
  phone: string | null;
  display_order: number;
  status: StaffStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type StaffInput = {
  fullName: string;
  roleTitle: string;
  shortBio?: string;
  email?: string;
  phone?: string;
  displayOrder?: number;
  status: StaffStatus;
};

export type PartnerStatus = "active" | "hidden";

export type PartnerItem = {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  description: string | null;
  display_order: number;
  status: PartnerStatus;
  is_text_only: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PartnerInput = {
  name: string;
  slug?: string;
  websiteUrl?: string;
  description?: string;
  displayOrder?: number;
  status: PartnerStatus;
  isTextOnly?: boolean;
};

export type MessageStatus = "new" | "read" | "replied" | "archived";

export type ContactMessageItem = {
  id: string;
  sender_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DonationMessageItem = {
  id: string;
  donor_name: string;
  email: string;
  phone: string | null;
  intended_amount: string | null;
  message: string | null;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8787";

async function requestApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  const envelope = await readJson<ApiEnvelope<T>>(response);

  if (!response.ok || !envelope?.ok) {
    const message =
      envelope && !envelope.ok
        ? envelope.error?.message
        : "The admin API request failed";
    throw new Error(message || "The admin API request failed");
  }

  return envelope.data;
}

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function loginAdmin(input: LoginInput) {
  return requestApi<{ admin: AdminUser }>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function getCurrentAdmin() {
  return requestApi<{ admin: AdminUser }>("/admin/auth/me");
}

export async function logoutAdmin() {
  return requestApi<{ loggedOut: boolean }>("/admin/auth/logout", {
    method: "POST"
  });
}

export async function changeAdminPassword(input: ChangePasswordInput) {
  return requestApi<{ passwordChanged: boolean; requiresLogin: boolean }>(
    "/admin/auth/change-password",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function listNews() {
  return requestApi<{ news: NewsItem[] }>("/admin/news");
}

export async function getNewsItem(id: string) {
  return requestApi<{ news: NewsItem }>(`/admin/news/${id}`);
}

export async function createNewsItem(input: NewsInput) {
  return requestApi<{ news: NewsItem }>("/admin/news", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateNewsItem(id: string, input: NewsInput) {
  return requestApi<{ news: NewsItem }>(`/admin/news/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function deleteNewsItem(id: string) {
  return requestApi<{ deleted: boolean }>(`/admin/news/${id}`, {
    method: "DELETE"
  });
}

export async function listEvents() {
  return requestApi<{ events: EventItem[] }>("/admin/events");
}

export async function getEventItem(id: string) {
  return requestApi<{ event: EventItem }>(`/admin/events/${id}`);
}

export async function createEventItem(input: EventInput) {
  return requestApi<{ event: EventItem }>("/admin/events", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateEventItem(id: string, input: EventInput) {
  return requestApi<{ event: EventItem }>(`/admin/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function deleteEventItem(id: string) {
  return requestApi<{ deleted: boolean }>(`/admin/events/${id}`, {
    method: "DELETE"
  });
}

export async function listProjects() {
  return requestApi<{ projects: ProjectItem[] }>("/admin/projects");
}

export async function getProjectItem(id: string) {
  return requestApi<{ project: ProjectItem }>(`/admin/projects/${id}`);
}

export async function createProjectItem(input: ProjectInput) {
  return requestApi<{ project: ProjectItem }>("/admin/projects", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateProjectItem(id: string, input: ProjectInput) {
  return requestApi<{ project: ProjectItem }>(`/admin/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function deleteProjectItem(id: string) {
  return requestApi<{ deleted: boolean }>(`/admin/projects/${id}`, {
    method: "DELETE"
  });
}

export async function listStaff() {
  return requestApi<{ staff: StaffItem[] }>("/admin/staff");
}

export async function getStaffItem(id: string) {
  return requestApi<{ staff: StaffItem }>(`/admin/staff/${id}`);
}

export async function createStaffItem(input: StaffInput) {
  return requestApi<{ staff: StaffItem }>("/admin/staff", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateStaffItem(id: string, input: StaffInput) {
  return requestApi<{ staff: StaffItem }>(`/admin/staff/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function deleteStaffItem(id: string) {
  return requestApi<{ deleted: boolean }>(`/admin/staff/${id}`, {
    method: "DELETE"
  });
}

export async function listPartners() {
  return requestApi<{ partners: PartnerItem[] }>("/admin/partners");
}

export async function getPartnerItem(id: string) {
  return requestApi<{ partner: PartnerItem }>(`/admin/partners/${id}`);
}

export async function createPartnerItem(input: PartnerInput) {
  return requestApi<{ partner: PartnerItem }>("/admin/partners", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updatePartnerItem(id: string, input: PartnerInput) {
  return requestApi<{ partner: PartnerItem }>(`/admin/partners/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function deletePartnerItem(id: string) {
  return requestApi<{ deleted: boolean }>(`/admin/partners/${id}`, {
    method: "DELETE"
  });
}

export async function listContactMessages() {
  return requestApi<{ messages: ContactMessageItem[] }>("/admin/contact-messages");
}

export async function getContactMessage(id: string) {
  return requestApi<{ message: ContactMessageItem }>(
    `/admin/contact-messages/${id}`
  );
}

export async function markContactMessageRead(id: string) {
  return requestApi<{ message: ContactMessageItem }>(
    `/admin/contact-messages/${id}/read`,
    {
      method: "PATCH"
    }
  );
}

export async function markContactMessageUnread(id: string) {
  return requestApi<{ message: ContactMessageItem }>(
    `/admin/contact-messages/${id}/unread`,
    {
      method: "PATCH"
    }
  );
}

export async function deleteContactMessage(id: string) {
  return requestApi<{ deleted: boolean }>(`/admin/contact-messages/${id}`, {
    method: "DELETE"
  });
}

export async function listDonationMessages() {
  return requestApi<{ messages: DonationMessageItem[] }>("/admin/donation-messages");
}

export async function getDonationMessage(id: string) {
  return requestApi<{ message: DonationMessageItem }>(
    `/admin/donation-messages/${id}`
  );
}

export async function markDonationMessageRead(id: string) {
  return requestApi<{ message: DonationMessageItem }>(
    `/admin/donation-messages/${id}/read`,
    {
      method: "PATCH"
    }
  );
}

export async function markDonationMessageUnread(id: string) {
  return requestApi<{ message: DonationMessageItem }>(
    `/admin/donation-messages/${id}/unread`,
    {
      method: "PATCH"
    }
  );
}

export async function deleteDonationMessage(id: string) {
  return requestApi<{ deleted: boolean }>(`/admin/donation-messages/${id}`, {
    method: "DELETE"
  });
}
