import {
  ContentSections,
  EmptyState,
  PageHero,
  pickHero
} from "@/components/public-components";
import { fetchPage } from "@/lib/public-api";

export default async function ContactPage() {
  const data = await fetchPage("contact");
  const hero = pickHero(data.blocks, "Contact");

  return (
    <>
      <PageHero block={hero} title="Contact" />
      {data.blocks.length > 0 ? (
        <ContentSections blocks={data.blocks} />
      ) : (
        <section className="section">
          <div className="container">
            <EmptyState label="No published contact content yet." />
          </div>
        </section>
      )}
    </>
  );
}
