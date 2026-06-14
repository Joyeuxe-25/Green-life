import {
  CardGrid,
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

  return (
    <>
      <PageHero block={hero} title="Home" />
      <ContentSections blocks={data.blocks} />

      <section className="section alt">
        <div className="container">
          <SectionHeading title="Impact" />
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

      <section className="section">
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

      <section className="section alt">
        <div className="container">
          <SectionHeading title="Projects" />
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
          <SectionHeading title="News" />
          {data.news.length > 0 ? (
            <CardGrid>
              {data.news.map((item) => (
                <NewsCard item={item} key={item.id} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No published news yet." />
          )}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHeading title="Events" />
          {data.events.length > 0 ? (
            <CardGrid>
              {data.events.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No public events yet." />
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="Partners" />
          {data.partners.length > 0 ? (
            <CardGrid>
              {data.partners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No active partners yet." />
          )}
        </div>
      </section>

      <CtaSection block={cta} />
    </>
  );
}
