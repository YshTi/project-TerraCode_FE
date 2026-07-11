"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import StoryCard from "@/components/story-card/story-card";
import { PageTitle } from "@/components/page-title/page-title";
import { Pagination } from "@/components/pagination/pagination";
import { getStories, getSavedStories } from "@/lib/api/clientApi";
import { useAuth } from "@/providers/auth-provider";

import css from "./page.module.css";

const LIMIT = 9;

export default function StoriesPage() {
  const { user } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["stories"],
    queryFn: ({ pageParam }) => getStories({ page: pageParam, limit: LIMIT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
  });

  const { data: savedData } = useQuery({
    queryKey: ["saved-stories"],
    queryFn: getSavedStories,
    enabled: !!user,
  });

  const savedIds = new Set(savedData?.stories.map((s) => s._id) ?? []);
  const stories = data?.pages.flatMap((page) => page.stories) ?? [];

  if (isLoading) {
    return <p className={css.status}>Завантаження...</p>;
  }

  if (isError) {
    return <p className={css.status}>Не вдалося завантажити статті</p>;
  }

  return (
    <section className={css.section_stories}>
      <PageTitle>Статті</PageTitle>

      <ul className={css.grid}>
        {stories.map((story) => (
          <StoryCard
            key={story._id}
            story={story}
            isSaved={savedIds.has(story._id)}
          />
        ))}
      </ul>

      <Pagination
        onLoadMore={fetchNextPage}
        isLoading={isFetchingNextPage}
        hasMore={!!hasNextPage}
      />
    </section>
  );
}