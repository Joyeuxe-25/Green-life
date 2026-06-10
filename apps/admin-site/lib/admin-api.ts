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
