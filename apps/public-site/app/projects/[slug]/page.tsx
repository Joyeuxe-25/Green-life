import { notFound } from "next/navigation";
import {
  PageHero,
  RichText,
  SectionHeading,
  formatDate
} from "@/components/public-components";
import { fetchProject } from "@/lib/public-api";

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchProject(slug).catch(() => null);
  if (!data) {
    notFound();
  }

  const project = data.project;

  return (
    <>
      <PageHero
        block={
          project.image_url
            ? {
                id: `${project.id}-hero`,
                page_key: "projects",
                block_key: "project-hero",
                block_type: "hero",
                eyebrow: project.category,
                title: project.title,
                subtitle: null,
                summary: project.summary,
                body: null,
                cta_label: null,
                cta_href: null,
                secondary_cta_label: null,
                secondary_cta_href: null,
                image_url: project.image_url,
                display_order: 0
              }
            : undefined
        }
        title={project.title}
      />
      <section className="section">
        <div className="container detail-layout">
          <SectionHeading
            title={project.title}
            summary={[
              [project.district, project.sector].filter(Boolean).join(", "),
              project.start_date ? formatDate(project.start_date) : ""
            ]
              .filter(Boolean)
              .join(" | ")}
          />
          {project.description ? (
            <RichText text={project.description} />
          ) : (
            <RichText text={project.summary} />
          )}
          {project.impact_summary ? <RichText text={project.impact_summary} /> : null}
        </div>
      </section>
    </>
  );
}
