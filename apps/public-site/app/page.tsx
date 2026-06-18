import {
  CardGrid,
  ContentBlockGrid,
  ContentSections,
  CtaSection,
  EmptyState,
  EventCard,
  ImpactStatCard,
  NewsCard,
  PageHero,
  PartnerCard,
  ProgramCard,
  ProjectCard,
  SectionHeading,
  pickHero
} from "@/components/public-components";
import { fetchHome } from "@/lib/public-api";

export default async function HomePage() {
  const data = await fetchHome();
  const hero = pickHero(data.blocks, "Home");
  const cta = data.blocks.find((block) => block.block_type === "cta");
  const contentBlocks = data.blocks.filter(
    (block) => block.block_type !== "hero" && block.block_type !== "cta"
  );
  const introBlocks = contentBlocks.filter((block) =>
    matchesBlock(block, ["intro", "overview", "mission", "about"])
  );
  const communityBlocks = contentBlocks.filter((block) =>
    matchesBlock(block, ["community", "voice", "voices", "story", "stories", "testimonial"])
  );
  const reservedBlockIds = new Set([
    ...introBlocks.map((block) => block.id),
    ...communityBlocks.map((block) => block.id)
  ]);
  const remainingBlocks = contentBlocks.filter((block) => !reservedBlockIds.has(block.id));
  const hasUpdates = data.news.length > 0 || data.events.length > 0;

  return (
    <>
      <PageHero block={hero} title="Home" />

      {introBlocks.length > 0 ? (
        <ContentSections blocks={introBlocks} />
      ) : (
        <ContentSections blocks={remainingBlocks.slice(0, 1)} />
      )}

      <section className="section alt">
        <div className="container">
          <SectionHeading eyebrow="What We Do" title="Our Areas of Work" />
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

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Our Impact" title="Environmental & Community Action in Numbers" />
          {data.impactStats.length > 0 ? (
            <CardGrid variant="stats">
              {data.impactStats.map((stat) => (
                <ImpactStatCard key={stat.id} stat={stat} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No published impact stats yet." />
          )}
        </div>
      </section>

      {communityBlocks.length > 0 ? (
        <section className="section alt">
          <div className="container">
            <SectionHeading eyebrow="Community Voices" title="Stories From the Field" />
            <ContentBlockGrid blocks={communityBlocks} />
          </div>
        </section>
      ) : null}

      {remainingBlocks.length > 1 ? <ContentSections blocks={remainingBlocks.slice(1)} /> : null}

      <section className="section alt">
        <div className="container">
          <SectionHeading eyebrow="Featured Activities" title="Practical Work in Communities" />
          {data.projects.length > 0 ? (
            <CardGrid>
              {data.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No public projects yet." />
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="Partners" />
          {data.partners.length > 0 ? (
            <CardGrid variant="partners">
              {data.partners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No active partners yet." />
          )}
        </div>
      </section>

      {hasUpdates ? (
        <section className="section alt">
          <div className="container home-preview-grid">
            {data.news.length > 0 ? (
              <div>
                <SectionHeading eyebrow="Latest Updates" title="News from Green Life Rwanda" />
                <CardGrid>
                  {data.news.map((item) => (
                    <NewsCard item={item} key={item.id} />
                  ))}
                </CardGrid>
              </div>
            ) : null}
            {data.events.length > 0 ? (
              <div>
                <SectionHeading title="Events" />
                <CardGrid>
                  {data.events.map((event) => (
                    <EventCard event={event} key={event.id} />
                  ))}
                </CardGrid>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <CtaSection block={cta} />
    </>
  );
}

function matchesBlock(
  block: {
    block_key: string;
    block_type: string;
    title: string | null;
  },
  terms: string[]
) {
  const text = `${block.block_key} ${block.block_type} ${block.title ?? ""}`.toLowerCase();
  return terms.some((term) => text.includes(term));
}
