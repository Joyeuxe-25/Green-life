import {
  CardGrid,
  EmptyState,
  PageHero,
  PartnerCard,
  SectionHeading,
  pickHero
} from "@/components/public-components";
import { fetchPartners } from "@/lib/public-api";

export default async function PartnersPage() {
  const { blocks, partners } = await fetchPartners();
  const hero = pickHero(blocks, "Partners");

  return (
    <>
      <PageHero block={hero} title="Partners" />
      <section className="section">
        <div className="container">
          <SectionHeading title="Partners" />
          {partners.length > 0 ? (
            <CardGrid variant="partners">
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
