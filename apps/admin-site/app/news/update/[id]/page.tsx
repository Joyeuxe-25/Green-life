"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { NewsForm } from "@/components/news-form";
import {
  getNewsItem,
  removeEntityImages,
  replaceEntityImage,
  updateNewsItem,
  type NewsInput,
  type NewsItem
} from "@/lib/admin-api";

export default function UpdateNewsItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getNewsItem(params.id)
      .then(({ news }) => {
        if (isMounted) {
          setNewsItem(news);
          setIsLoading(false);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load news item."
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  async function handleSubmit(input: NewsInput) {
    setError("");
    setIsSubmitting(true);
    try {
      const { imageFile, removeImage, ...payload } = input;
      const { news } = await updateNewsItem(params.id, payload);
      if (imageFile) {
        await replaceEntityImage("news", news.id, imageFile);
      } else if (removeImage) {
        await removeEntityImages("news", news.id);
      }
      router.replace("/news");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update news item."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            News
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Update News
          </h2>
        </div>
        <Link
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
          href="/news"
        >
          Back to News
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Loading news item...
        </div>
      ) : null}

      {!isLoading && newsItem ? (
        <NewsForm
          initialNews={newsItem}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      ) : null}
    </AdminShell>
  );
}
