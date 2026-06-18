import {
  CardGrid,
  EmptyState,
  PageHero,
  SectionHeading,
  StaffCard
} from "@/components/public-components";
import { fetchStaff } from "@/lib/public-api";

export default async function StaffPage() {
  const { staff } = await fetchStaff();

  return (
    <>
      <PageHero title="Staff" />
      <section className="section">
        <div className="container">
          <SectionHeading title="Staff" />
          {staff.length > 0 ? (
            <CardGrid>
              {staff.map((member) => (
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
