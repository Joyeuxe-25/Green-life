import {
  ContentSections,
  EmptyState,
  CardGrid,
  PageHero,
  RichText,
  SectionHeading,
  StaffCard,
  pickHero
} from "@/components/public-components";
import { fetchPage, fetchStaff } from "@/lib/public-api";

const founderProfile = [
  "Polycarpe Nsanzamahoro envisions a world in which every community is food secure, families are resilient to the effects of climate change, and people live with dignity, happiness, and peace.",
  "With a professional background in Agroforestry and a Master's degree in Development Studies, Polycarpe has developed a deep understanding of the relationship between environmental sustainability, agriculture, and community development. Through his studies and engagement with rural communities, he witnessed the challenges faced by small-scale farmers - people who play a vital role in feeding the nation but often have limited access to knowledge, resources, markets, and climate-resilient farming solutions.",
  "These experiences inspired him to establish Green for Life Rwanda (GLR), an organization committed to improving livelihoods and strengthening community resilience through sustainable agroforestry practices across Rwanda.",
  "Polycarpe believes that agroforestry is more than a farming technique. By integrating trees with crops and livestock, communities can restore degraded land, improve soil fertility, protect biodiversity, increase agricultural productivity, and strengthen their ability to cope with climate change. For him, protecting the environment and improving people's livelihoods are not separate goals - they are part of the same journey toward sustainable development.",
  "At the heart of Polycarpe's leadership is a strong belief in community participation and collaboration. He understands that lasting change cannot be imposed from outside. It must be developed together with the people who understand their land, challenges, and aspirations best. This is why Green for Life Rwanda works closely with farmers, young people, women, local leaders, development partners, and other community stakeholders.",
  "Polycarpe is particularly passionate about placing people at the center of environmental action. He believes that communities should not only be beneficiaries of development programs but active leaders in identifying problems, designing solutions, and building the future they want to see.",
  "Through Green for Life Rwanda, his ambition is not only to transform landscapes but also to inspire a transformation in mindsets - encouraging communities to view trees, sustainable agriculture, and environmental conservation as valuable investments in their future.",
  "Polycarpe remains committed to building partnerships, promoting practical community-based solutions, and empowering people to become agents of positive change."
].join("\n\n");

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
      <section className="section">
        <div className="container">
          <article className="content-panel">
            <div className="content-copy">
              <SectionHeading
                eyebrow="Leadership"
                title="Founder & Executive Director"
                summary="Polycarpe Nsanzamahoro"
              />
              <RichText text={founderProfile} />
            </div>
            <div
              className="content-media content-media-side"
              style={{ aspectRatio: "4 / 5" }}
            >
              <img
                alt="Polycarpe Nsanzamahoro, Founder and Executive Director of Green for Life Rwanda"
                className="media-image"
                height={960}
                loading="lazy"
                src="/images/founder.jpeg"
                style={{ objectFit: "contain" }}
                width={720}
              />
            </div>
          </article>
        </div>
      </section>
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
