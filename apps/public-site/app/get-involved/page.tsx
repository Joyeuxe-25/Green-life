import {
  ContentSections,
  EmptyState,
  PageHero,
  pickHero
} from "@/components/public-components";
import { fetchPage } from "@/lib/public-api";

export default async function GetInvolvedPage() {
  const data = await fetchPage("get-involved");
  const hero = pickHero(data.blocks, "Get Involved");

  return (
    <>
      <PageHero block={hero} title="Get Involved" />
      {data.blocks.length > 0 ? (
        <ContentSections blocks={data.blocks} />
      ) : (
        <section className="section">
          <div className="container">
            <EmptyState label="No published get involved content yet." />
          </div>
        </section>
      )}
    </>
  );
}
