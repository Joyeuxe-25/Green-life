import {
  ContentSections,
  EmptyState,
  PageHero,
  pickHero
} from "@/components/public-components";
import { DonationForm } from "@/components/donation-form";
import { fetchPage } from "@/lib/public-api";

export default async function DonatePage() {
  const data = await fetchPage("donate");
  const hero = pickHero(data.blocks, "Donate");

  return (
    <>
      <PageHero block={hero} title="Donate" />
      {data.blocks.length > 0 ? (
        <ContentSections blocks={data.blocks} />
      ) : (
        <section className="section">
          <div className="container">
            <EmptyState label="No published donation content yet." />
          </div>
        </section>
      )}
      <DonationForm />
    </>
  );
}
