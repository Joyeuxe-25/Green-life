import {
  ContentSections,
  EmptyState,
  PageHero,
  pickHero
} from "@/components/public-components";
import { fetchPage } from "@/lib/public-api";

export default async function AboutPage() {
  const data = await fetchPage("about");
  const hero = pickHero(data.blocks, "About");

  return (
    <>
      <PageHero block={hero} title="About" />
      {data.blocks.length > 0 ? (
        <ContentSections blocks={data.blocks} />
      ) : (
        <section className="section">
          <div className="container">
            <EmptyState label="No published about content yet." />
          </div>
        </section>
      )}
    </>
  );
}
