import {
  CardGrid,
  EmptyState,
  EventCard,
  PageHero,
  SectionHeading
} from "@/components/public-components";
import { fetchEvents } from "@/lib/public-api";

export default async function EventsPage() {
  const { events } = await fetchEvents();

  return (
    <>
      <PageHero title="Events" />
      <section className="section">
        <div className="container">
          <SectionHeading title="Events" />
          {events.length > 0 ? (
            <CardGrid>
              {events.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No public events yet." />
          )}
        </div>
      </section>
    </>
  );
}
