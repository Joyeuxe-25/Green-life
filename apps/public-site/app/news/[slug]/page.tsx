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
      <PageHero
        block={
          item.image_url
            ? {
                id: `${item.id}-hero`,
                page_key: "news",
                block_key: "news-hero",
                block_type: "hero",
                eyebrow: item.category,
                title: item.title,
                subtitle: null,
                summary: item.excerpt,
                body: null,
                cta_label: null,
                cta_href: null,
                secondary_cta_label: null,
                secondary_cta_href: null,
                image_url: item.image_url,
                display_order: 0
              }
            : undefined
        }
        title={item.title}
      />
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
