import {
  CardGrid,
  EmptyState,
  PageHero,
  ProjectCard,
  SectionHeading
} from "@/components/public-components";
import { fetchProjects } from "@/lib/public-api";

export default async function ProjectsPage() {
  const { projects } = await fetchProjects();

  return (
    <>
      <PageHero title="Projects" />
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
