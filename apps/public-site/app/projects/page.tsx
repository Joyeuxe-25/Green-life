import {
  CardGrid,
  EmptyState,
  PageHero,
  ProjectCard,
  SectionHeading,
  pickHero
} from "@/components/public-components";
import { fetchProjects } from "@/lib/public-api";

export default async function ProjectsPage() {
  const { blocks, projects } = await fetchProjects();
  const hero = pickHero(blocks, "Projects");

  return (
    <>
      <PageHero block={hero} title="Projects" />
      <section className="section">
        <div className="container">
          <SectionHeading title="Projects" />
          {projects.length > 0 ? (
            <CardGrid>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No public projects yet." />
          )}
        </div>
      </section>
    </>
  );
}
