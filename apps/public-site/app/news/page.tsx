import {
  CardGrid,
  EmptyState,
  NewsCard,
  PageHero,
  SectionHeading
} from "@/components/public-components";
import { fetchNews } from "@/lib/public-api";

export default async function NewsPage() {
  const { news } = await fetchNews();

  return (
    <>
      <PageHero title="News" />
      <section className="section">
        <div className="container">
          <SectionHeading title="News" />
          {news.length > 0 ? (
            <CardGrid>
              {news.map((item) => (
                <NewsCard item={item} key={item.id} />
              ))}
            </CardGrid>
          ) : (
            <EmptyState label="No published news yet." />
          )}
        </div>
      </section>
    </>
  );
}
