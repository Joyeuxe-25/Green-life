const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "";

type ApiEnvelope<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error?: {
        message?: string;
      };
    };

export type ContentBlock = {
  id: string;
  page_key: string;
  block_key: string;
  block_type: string;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  summary: string | null;
  body: string | null;
  cta_label: string | null;
  cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  image_url: string | null;
  display_order: number;
};

export type ImpactStat = {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  description: string | null;
  display_order: number;
};

export type Program = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  icon_name: string | null;
  display_order: number;
};

export type SiteSetting = {
  key: string;
  group_key: string;
  label: string;
  value: string | null;
  field_type: string;
};

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  image_alt_text: string | null;
  image_caption: string | null;
};

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
  status: string;
  image_url: string | null;
  image_alt_text: string | null;
  image_caption: string | null;
};

export type ProjectItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  district: string | null;
  sector: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  category: string | null;
  impact_summary: string | null;
  image_url: string | null;
  image_alt_text: string | null;
  image_caption: string | null;
};

export type StaffMember = {
  id: string;
  full_name: string;
  role_title: string;
  short_bio: string | null;
  email: string | null;
  phone: string | null;
  display_order: number;
};

export type Partner = {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  description: string | null;
  display_order: number;
  is_text_only: number;
  logo_url: string | null;
  logo_alt_text: string | null;
  logo_caption: string | null;
};

export type MediaItem = {
  id: string;
  public_url: string | null;
  alt_text: string | null;
  caption: string | null;
  mime_type: string;
  entity_type: string | null;
  entity_id: string | null;
  display_order: number;
  created_at: string;
};

export type PageData = {
  page: string;
  blocks: ContentBlock[];
  siteSettings?: SiteSetting[];
};

export type HomeData = PageData & {
  impactStats: ImpactStat[];
  programs: Program[];
  projects: ProjectItem[];
  news: NewsItem[];
  events: EventItem[];
  partners: Partner[];
  siteSettings: SiteSetting[];
};

export type ProgramsPageData = PageData & {
  programs: Program[];
};

export type ImpactPageData = PageData & {
  impactStats: ImpactStat[];
};

export type PartnersPageData = PageData & {
  partners: Partner[];
};

export type ProjectsPageData = PageData & {
  projects: ProjectItem[];
};

export type ContactMessageInput = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export type DonationMessageInput = {
  name: string;
  email: string;
  phone?: string;
  donation_interest?: string;
  message: string;
};

export async function fetchHome() {
  return requestPublic<HomeData>("/public/home");
}

export async function fetchPage(path: string) {
  return requestPublic<PageData>(`/public/${path}`);
}

export async function fetchProgramsPage() {
  return requestPublic<ProgramsPageData>("/public/programs");
}

export async function fetchImpactPage() {
  return requestPublic<ImpactPageData>("/public/impact");
}

export async function fetchNews() {
  return requestPublic<{ news: NewsItem[] }>("/public/news");
}

export async function fetchNewsItem(slug: string) {
  return requestPublic<{ news: NewsItem }>(`/public/news/${slug}`);
}

export async function fetchEvents() {
  return requestPublic<{ events: EventItem[] }>("/public/events");
}

export async function fetchEvent(slug: string) {
  return requestPublic<{ event: EventItem }>(`/public/events/${slug}`);
}

export async function fetchProjects() {
  return requestPublic<ProjectsPageData>("/public/projects");
}

export async function fetchProject(slug: string) {
  return requestPublic<{ project: ProjectItem }>(`/public/projects/${slug}`);
}

export async function fetchStaff() {
  return requestPublic<{ staff: StaffMember[] }>("/public/staff");
}

export async function fetchPartners() {
  return requestPublic<PartnersPageData>("/public/partners");
}

export async function fetchMedia() {
  return requestPublic<{ media: MediaItem[] }>("/public/media");
}

export async function fetchSiteSettings() {
  return requestPublic<{ siteSettings: SiteSetting[] }>("/public/site-settings");
}

export async function submitContactMessage(input: ContactMessageInput) {
  return mutatePublic<{ messageId: string }>("/public/contact-messages", input);
}

export async function submitDonationMessage(input: DonationMessageInput) {
  return mutatePublic<{ messageId: string }>("/public/donation-messages", input);
}

export function resolvePublicUrl(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${API_BASE_URL}${value}`;
  }

  return value;
}

async function requestPublic<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store"
  });
  const envelope = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !envelope.ok) {
    const message =
      envelope && !envelope.ok
        ? envelope.error?.message
        : "Public API request failed";
    throw new Error(message || "Public API request failed");
  }

  return envelope.data;
}

async function mutatePublic<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const envelope = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !envelope.ok) {
    const message =
      envelope && !envelope.ok
        ? envelope.error?.message
        : "Public API request failed";
    throw new Error(message || "Public API request failed");
  }

  return envelope.data;
}
