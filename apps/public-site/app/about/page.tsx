import {
  ContentSections,
  EmptyState,
  CardGrid,
  PageHero,
  SectionHeading,
  StaffCard,
  pickHero
} from "@/components/public-components";
import { fetchPage, fetchStaff } from "@/lib/public-api";

export default async function AboutPage() {
  const [data, staffData] = await Promise.all([fetchPage("about"), fetchStaff()]);
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
      <section className="section alt">
        <div className="container">
          <SectionHeading
            eyebrow="Our Team"
            title="Staff"
          />
          {staffData.staff.length > 0 ? (
            <CardGrid>
              {staffData.staff.map((member) => (
                <StaffCard key={member.id} member={member} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="Staff profiles will be updated soon." />
          )}
        </div>
      </section>
    </>
  );
}
