import { notFound } from "next/navigation";
import {
  PageHero,
  RichText,
  SectionHeading,
  formatDate
} from "@/components/public-components";
import { fetchEvent } from "@/lib/public-api";

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchEvent(slug).catch(() => null);
  if (!data) {
    notFound();
  }

  const event = data.event;

  return (
    <>
      <PageHero
        block={
          event.image_url
            ? {
                id: `${event.id}-hero`,
                page_key: "events",
                block_key: "event-hero",
                block_type: "hero",
                eyebrow: event.category,
                title: event.title,
                subtitle: null,
                summary: event.description,
                body: null,
                cta_label: null,
                cta_href: null,
                secondary_cta_label: null,
                secondary_cta_href: null,
                image_url: event.image_url,
                display_order: 0
              }
            : undefined
        }
        title={event.title}
      />
      <section className="section">
        <div className="container detail-layout">
          <SectionHeading
            title={event.title}
            summary={[formatDate(event.event_date), event.location]
              .filter(Boolean)
              .join(" | ")}
          />
          <RichText text={event.description} />
        </div>
      </section>
    </>
  );
}
