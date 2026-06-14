import {
  CardGrid,
  ContentSections,
  EmptyState,
  ImpactStatCard,
  PageHero,
  SectionHeading,
  pickHero
} from "@/components/public-components";
import { fetchImpactPage } from "@/lib/public-api";

export default async function ImpactPage() {
  const data = await fetchImpactPage();
  const hero = pickHero(data.blocks, "Impact");

  return (
    <>
      <PageHero block={hero} title="Impact" />
      <ContentSections blocks={data.blocks} />
      <section className="section alt">
        <div className="container">
          <SectionHeading title="Impact Stats" />
          {data.impactStats.length > 0 ? (
            <CardGrid>
              {data.impactStats.map((stat) => (
                <ImpactStatCard key={stat.id} stat={stat} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No published impact stats yet." />
          )}
        </div>
      </section>
    </>
  );
}
