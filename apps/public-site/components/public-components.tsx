import Link from "next/link";
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

  return (
    <section className="hero-band">
      {hero.image_url ? <MediaImage alt={hero.title ?? title} src={hero.image_url} /> : null}
      <div className="hero-overlay" />
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
  const sections = blocks.filter((block) => block.block_type !== "hero");
  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <div className="container section-stack">
        {sections.map((block) => (
          <article className="content-panel" key={block.id}>
            <SectionHeading
              eyebrow={block.eyebrow}
              title={block.title || block.block_key}
              summary={block.subtitle || block.summary}
            />
            {block.image_url ? (
              <div className="content-media">
                <MediaImage alt={block.title || block.block_key} src={block.image_url} />
              </div>
            ) : null}
            {block.body ? <RichText text={block.body} /> : null}
            <CtaButtons block={block} />
          </article>
        ))}
      </div>
    </section>
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
      <p>{label}</p>
    </div>
  );
}

export function MediaImage({ alt, src }: { alt: string; src: string }) {
  return <img alt={alt} className="media-image" src={src} />;
}

export function ImpactStatCard({ stat }: { stat: ImpactStat }) {
  return (
    <article className="stat-card">
      <p className="stat-value">
        {stat.value}
        {stat.suffix}
      </p>
      <h3>{stat.label}</h3>
      {stat.description ? <p>{stat.description}</p> : null}
    </article>
  );
}

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="info-card">
      {program.icon_name ? <p className="card-kicker">{program.icon_name}</p> : null}
      <h3>{program.title}</h3>
      {program.summary ? <p>{program.summary}</p> : null}
    </article>
  );
}

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <article className="info-card">
      <p className="card-kicker">{[project.district, project.sector].filter(Boolean).join(", ") || project.status}</p>
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
    <article className="info-card">
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
    <article className="info-card">
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
    <article className="info-card">
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
  return (
    <article className="info-card">
      <h3>{partner.name}</h3>
      {partner.description ? <p>{partner.description}</p> : null}
      {partner.website_url ? (
        <a className="text-link" href={partner.website_url}>
          Visit website
        </a>
      ) : null}
    </article>
  );
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

export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="card-grid">{children}</div>;
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
