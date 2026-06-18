import Link from "next/link";
import {
  CalendarDays,
  CloudSun,
  ExternalLink,
  GraduationCap,
  HandHeart,
  Handshake,
  Leaf,
  MapPinned,
  Newspaper,
  Sprout,
  Trees,
  TreePine,
  UsersRound
} from "lucide-react";
import { AnimatedImpactStatCard } from "@/components/animated-impact-stat-card";
import { resolvePublicUrl } from "@/lib/public-api";
import type {
  ContentBlock,
  EventItem,
  ImpactStat,
  MediaItem,
  NewsItem,
  Partner,
  Program,
  ProjectItem,
  SiteSetting,
  StaffMember
} from "@/lib/public-api";

export function getSetting(settings: SiteSetting[] | undefined, key: string) {
  return settings?.find((setting) => setting.key === key)?.value ?? "";
}

export function pickHero(blocks: ContentBlock[], fallbackTitle: string) {
  return (
    blocks.find((block) => block.block_type === "hero") ??
    blocks[0] ?? {
      id: "fallback",
      page_key: "",
      block_key: "fallback",
      block_type: "hero",
      eyebrow: null,
      title: fallbackTitle,
      subtitle: null,
      summary: null,
      body: null,
      cta_label: null,
      cta_href: null,
      secondary_cta_label: null,
      secondary_cta_href: null,
      image_url: null,
      display_order: 0
    }
  );
}

export function PageHero({ block, title }: { block?: ContentBlock; title: string }) {
  const hero = block ?? pickHero([], title);
  const hasImage = Boolean(hero.image_url);

  return (
    <section className={`hero-band${hasImage ? " has-image" : ""}`}>
      {hero.image_url ? <MediaImage alt={hero.title ?? title} src={hero.image_url} priority /> : null}
      <div className="container hero-content">
        {hero.eyebrow ? <p className="eyebrow light">{hero.eyebrow}</p> : null}
        <h1>{hero.title || title}</h1>
        {hero.subtitle || hero.summary ? (
          <p>{hero.subtitle || hero.summary}</p>
        ) : null}
        <div className="hero-actions">
          {hero.cta_label && hero.cta_href ? (
            <Link className="button primary" href={hero.cta_href}>
              {hero.cta_label}
            </Link>
          ) : null}
          {hero.secondary_cta_label && hero.secondary_cta_href ? (
            <Link className="button secondary" href={hero.secondary_cta_href}>
              {hero.secondary_cta_label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  summary
}: {
  eyebrow?: string | null;
  title: string;
  summary?: string | null;
}) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {summary ? <p>{summary}</p> : null}
    </div>
  );
}

export function ContentSections({ blocks }: { blocks: ContentBlock[] }) {
  const sections = blocks.filter(
    (block) => block.block_type !== "hero" && block.block_type !== "cta"
  );
  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <div className="container section-stack">
        {sections.map((block) => (
          <article className="content-panel" key={block.id}>
            <div className="content-copy">
              <SectionHeading
                eyebrow={block.eyebrow}
                title={block.title || block.block_key}
                summary={block.subtitle || block.summary}
              />
              {block.body ? <RichText text={block.body} /> : null}
              <CtaButtons block={block} />
            </div>
            {block.image_url ? (
              <div className="content-media content-media-side">
                <MediaImage alt={block.title || block.block_key} src={block.image_url} />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function ContentBlockCard({ block }: { block: ContentBlock }) {
  return (
    <article className="info-card content-card">
      {block.image_url ? (
        <div className="card-media">
          <MediaImage alt={block.title || block.block_key} src={block.image_url} />
        </div>
      ) : null}
      {block.eyebrow ? <p className="card-kicker">{block.eyebrow}</p> : null}
      <h3>{block.title || block.block_key}</h3>
      {block.summary || block.subtitle ? <p>{block.summary || block.subtitle}</p> : null}
      {block.body ? <RichText text={block.body} /> : null}
      <CtaButtons block={block} />
    </article>
  );
}

export function ContentBlockGrid({ blocks }: { blocks: ContentBlock[] }) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <CardGrid>
      {blocks.map((block) => (
        <ContentBlockCard block={block} key={block.id} />
      ))}
    </CardGrid>
  );
}

export function CtaSection({ block }: { block?: ContentBlock }) {
  if (!block) {
    return null;
  }

  return (
    <section className="section cta-band">
      <div className="container cta-inner">
        <SectionHeading
          eyebrow={block.eyebrow}
          title={block.title || block.block_key}
          summary={block.summary || block.subtitle}
        />
        {block.body ? <RichText text={block.body} /> : null}
        <CtaButtons block={block} />
      </div>
    </section>
  );
}

export function CtaButtons({ block }: { block: ContentBlock }) {
  if (!block.cta_label && !block.secondary_cta_label) {
    return null;
  }

  return (
    <div className="button-row">
      {block.cta_label && block.cta_href ? (
        <Link className="button primary" href={block.cta_href}>
          {block.cta_label}
        </Link>
      ) : null}
      {block.secondary_cta_label && block.secondary_cta_href ? (
        <Link className="button outline" href={block.secondary_cta_href}>
          {block.secondary_cta_label}
        </Link>
      ) : null}
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="empty-state">
      <span aria-hidden="true" className="empty-state-mark" />
      <p>{label}</p>
    </div>
  );
}

export function MediaImage({
  alt,
  priority,
  src
}: {
  alt: string;
  priority?: boolean;
  src: string;
}) {
  return <img alt={alt} className="media-image" loading={priority ? "eager" : "lazy"} src={resolvePublicUrl(src)} />;
}

export function ImpactStatCard({ stat }: { stat: ImpactStat }) {
  return <AnimatedImpactStatCard stat={stat} />;
}

export function ProgramCard({ program }: { program: Program }) {
  const Icon = getProgramIcon(
    [program.icon_name, program.slug, program.title].filter(Boolean).join(" ")
  );

  return (
    <article className="info-card program-card reveal-card">
      <span className="card-icon" aria-hidden="true">
        <Icon size={21} />
      </span>
      <h3>{program.title}</h3>
      {program.summary ? <p>{program.summary}</p> : null}
    </article>
  );
}

export function ProjectCard({ project }: { project: ProjectItem }) {
  const Icon = getProjectIcon(project.category || project.title);

  return (
    <article className="info-card reveal-card">
      {project.image_url ? (
        <div className="card-media">
          <MediaImage
            alt={project.image_alt_text || project.image_caption || project.title}
            src={project.image_url}
          />
        </div>
      ) : null}
      <span className="card-icon" aria-hidden="true">
        <Icon size={21} />
      </span>
      <p className="card-kicker">
        {[project.district, project.sector].filter(Boolean).join(", ") || project.status}
      </p>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <Link className="text-link" href={`/projects/${project.slug}`}>
        View project
      </Link>
    </article>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="info-card reveal-card">
      {item.image_url ? (
        <div className="card-media">
          <MediaImage
            alt={item.image_alt_text || item.image_caption || item.title}
            src={item.image_url}
          />
        </div>
      ) : null}
      {!item.image_url ? (
        <span className="card-icon" aria-hidden="true">
          <Newspaper size={21} />
        </span>
      ) : null}
      <p className="card-kicker">{formatDate(item.published_at || item.created_at)}</p>
      <h3>{item.title}</h3>
      <p>{item.excerpt}</p>
      <Link className="text-link" href={`/news/${item.slug}`}>
        Read more
      </Link>
    </article>
  );
}

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="info-card reveal-card">
      {event.image_url ? (
        <div className="card-media">
          <MediaImage
            alt={event.image_alt_text || event.image_caption || event.title}
            src={event.image_url}
          />
        </div>
      ) : null}
      {!event.image_url ? (
        <span className="card-icon" aria-hidden="true">
          <CalendarDays size={21} />
        </span>
      ) : null}
      <p className="card-kicker">{formatDate(event.event_date)}</p>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <Link className="text-link" href={`/events/${event.slug}`}>
        View event
      </Link>
    </article>
  );
}

export function StaffCard({ member }: { member: StaffMember }) {
  return (
    <article className="info-card staff-card reveal-card">
      <span className="card-icon" aria-hidden="true">
        <UsersRound size={21} />
      </span>
      <p className="card-kicker">{member.role_title}</p>
      <h3>{member.full_name}</h3>
      {member.short_bio ? <p>{member.short_bio}</p> : null}
      {[member.email, member.phone].filter(Boolean).length > 0 ? (
        <p className="small-text">{[member.email, member.phone].filter(Boolean).join(" | ")}</p>
      ) : null}
    </article>
  );
}

export function PartnerCard({ partner }: { partner: Partner }) {
  const cardTitle = `${partner.name}${partner.website_url ? " website" : ""}`;
  const content = (
    <>
      <div className="logo-frame">
        {partner.logo_url && !partner.is_text_only ? (
          <img
            alt={partner.logo_alt_text || partner.logo_caption || `${partner.name} logo`}
            className="logo-image"
            src={resolvePublicUrl(partner.logo_url)}
          />
        ) : (
          <span>{partner.name}</span>
        )}
      </div>
      <h3>{partner.name}</h3>
    </>
  );

  return (
    <article className="info-card partner-card reveal-card">
      {partner.website_url ? (
        <a
          aria-label={cardTitle}
          className="partner-card-link"
          href={partner.website_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {content}
        </a>
      ) : (
        content
      )}
      {partner.description ? <p>{partner.description}</p> : null}
      {partner.website_url ? (
        <a
          className="text-link card-action-link"
          href={partner.website_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          Visit website <ExternalLink aria-hidden="true" size={14} />
        </a>
      ) : null}
    </article>
  );
}

function getProgramIcon(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, "");

  if (
    normalized.includes("agroforestry") ||
    normalized.includes("sprout") ||
    normalized.includes("seed") ||
    normalized.includes("tree") ||
    normalized.includes("trees")
  ) {
    return Trees;
  }

  if (
    normalized.includes("climate") ||
    normalized.includes("cloudsun") ||
    normalized.includes("leaf")
  ) {
    return CloudSun;
  }

  if (
    normalized.includes("graduationcap") ||
    normalized.includes("school") ||
    normalized.includes("education") ||
    normalized.includes("youth")
  ) {
    return GraduationCap;
  }

  if (
    normalized.includes("community") ||
    normalized.includes("livelihood") ||
    normalized.includes("handshake") ||
    normalized.includes("handheart") ||
    normalized.includes("support")
  ) {
    return HandHeart;
  }

  return Leaf;
}

function getProjectIcon(value: string) {
  const normalized = value.toLowerCase();

  if (normalized.includes("school") || normalized.includes("education") || normalized.includes("youth")) {
    return GraduationCap;
  }

  if (normalized.includes("climate")) {
    return CloudSun;
  }

  if (normalized.includes("agro") || normalized.includes("restoration") || normalized.includes("tree")) {
    return TreePine;
  }

  if (normalized.includes("livelihood") || normalized.includes("community")) {
    return HandHeart;
  }

  if (normalized.includes("gisagara") || normalized.includes("rutsiro") || normalized.includes("nyanza")) {
    return MapPinned;
  }

  return Sprout;
}

export function MediaGrid({ media }: { media: MediaItem[] }) {
  if (media.length === 0) {
    return <EmptyState label="No media is published yet." />;
  }

  return (
    <div className="media-grid">
      {media
        .filter((item) => item.public_url)
        .map((item) => (
          <figure className="media-tile" key={item.id}>
            <MediaImage alt={item.alt_text || item.caption || "Published media"} src={item.public_url as string} />
            {item.caption ? <figcaption>{item.caption}</figcaption> : null}
          </figure>
        ))}
    </div>
  );
}

export function RichText({ text }: { text: string }) {
  return (
    <div className="rich-text">
      {text.split(/\n{2,}/).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

export function CardGrid({
  children,
  variant = "default"
}: {
  children: React.ReactNode;
  variant?: "default" | "stats" | "partners";
}) {
  return <div className={`card-grid card-grid-${variant}`}>{children}</div>;
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(date);
}
