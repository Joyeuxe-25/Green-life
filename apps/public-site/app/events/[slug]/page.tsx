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
      <PageHero title={event.title} />
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
