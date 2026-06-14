import {
  CardGrid,
  EmptyState,
  PageHero,
  PartnerCard,
  SectionHeading
} from "@/components/public-components";
import { fetchPartners } from "@/lib/public-api";

export default async function PartnersPage() {
  const { partners } = await fetchPartners();

  return (
    <>
      <PageHero title="Partners" />
      <section className="section">
        <div className="container">
          <SectionHeading title="Partners" />
          {partners.length > 0 ? (
            <CardGrid>
              {partners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No active partners yet." />
          )}
        </div>
      </section>
    </>
  );
}
