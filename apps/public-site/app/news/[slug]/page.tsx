import { notFound } from "next/navigation";
import {
  PageHero,
  RichText,
  SectionHeading,
  formatDate
} from "@/components/public-components";
import { fetchNewsItem } from "@/lib/public-api";

export default async function NewsDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchNewsItem(slug).catch(() => null);
  if (!data) {
    notFound();
  }

  const item = data.news;

  return (
    <>
      <PageHero title={item.title} />
      <section className="section">
        <div className="container detail-layout">
          <SectionHeading
            title={item.title}
            summary={formatDate(item.published_at || item.created_at)}
          />
          <RichText text={item.content || item.excerpt} />
        </div>
      </section>
    </>
  );
}
