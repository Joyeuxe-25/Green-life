import {
  CardGrid,
  ContentSections,
  EmptyState,
  PageHero,
  ProgramCard,
  SectionHeading,
  pickHero
} from "@/components/public-components";
import { fetchProgramsPage } from "@/lib/public-api";

export default async function ProgramsPage() {
  const data = await fetchProgramsPage();
  const hero = pickHero(data.blocks, "Programs");

  return (
    <>
      <PageHero block={hero} title="Programs" />
      <ContentSections blocks={data.blocks} />
      <section className="section alt">
        <div className="container">
          <SectionHeading title="Programs" />
          {data.programs.length > 0 ? (
            <CardGrid>
              {data.programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No published programs yet." />
          )}
        </div>
      </section>
    </>
  );
}
