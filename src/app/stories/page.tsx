"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { CategoriesFilter } from "@/components/categories-filter/categories-filter";
import { Container } from "@/components/container/container";
import { Loader } from "@/components/loader/loader";
import { PageTitle } from "@/components/page-title/page-title";
import { Pagination } from "@/components/pagination/pagination";
import StoryCard from "@/components/story-card/story-card";
import {
  getCategories,
  getSavedStories,
  getStories,
} from "@/lib/api/clientApi";
import { useAuth } from "@/providers/auth-provider";
import { notify } from "@/utils/notify";

import css from "./page.module.css";

const MOBILE_TABLET_LIMIT = 8;
const DESKTOP_LIMIT = 9;
const DESKTOP_MEDIA_QUERY = "(min-width: 1440px)";

function useStoriesLimit() {
  const [limit, setLimit] = useState(MOBILE_TABLET_LIMIT);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const updateLimit = () => {
      setLimit(
        mediaQuery.matches
          ? DESKTOP_LIMIT
          : MOBILE_TABLET_LIMIT,
      );
    };

    updateLimit();
    mediaQuery.addEventListener("change", updateLimit);

    return () => {
      mediaQuery.removeEventListener("change", updateLimit);
    };
  }, []);

  return limit;
}

export default function StoriesPage() {
  const { user } = useAuth();
  const limit = useStoriesLimit();

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const storiesQuery = useInfiniteQuery({
    queryKey: [
      "stories",
      {
        limit,
        category: selectedCategory,
      },
    ],

    queryFn: ({ pageParam }) =>
      getStories({
        page: pageParam,
        limit,
        category: selectedCategory ?? undefined,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNextPage) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },
  });

  const savedStoriesQuery = useQuery({
    queryKey: ["saved-stories"],
    queryFn: getSavedStories,
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (categoriesQuery.isError) {
      notify.error("Не вдалося завантажити категорії");
    }
  }, [categoriesQuery.isError]);

  useEffect(() => {
    if (storiesQuery.isError) {
      notify.error("Не вдалося завантажити статті");
    }
  }, [storiesQuery.isError]);

  const savedIds = useMemo(() => {
    return new Set(
      savedStoriesQuery.data?.stories.map(
        (story) => story._id,
      ) ?? [],
    );
  }, [savedStoriesQuery.data]);

  const stories = useMemo(() => {
    return (
      storiesQuery.data?.pages.flatMap(
        (page) => page.stories,
      ) ?? []
    );
  }, [storiesQuery.data]);

  const handleCategoryChange = (
    categoryId: string | null,
  ) => {
    setSelectedCategory(categoryId);
  };

  const handleLoadMore = () => {
    if (
      storiesQuery.hasNextPage &&
      !storiesQuery.isFetchingNextPage
    ) {
      void storiesQuery.fetchNextPage();
    }
  };

  const isInitialLoading =
    categoriesQuery.isLoading || storiesQuery.isLoading;

  return (
    <section className={css.section}>
      <Container className={css.storyContainer}>
        <PageTitle className={css.title}>Статті</PageTitle>

        <CategoriesFilter
          categories={categoriesQuery.data ?? []}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          disabled={storiesQuery.isLoading}
        />

        {isInitialLoading && (
          <div className={css.loaderWrapper}>
            <Loader />
          </div>
        )}

        {!isInitialLoading &&
          storiesQuery.isSuccess &&
          stories.length === 0 && (
            <p className={css.empty}>
              У цій категорії немає статей
            </p>
          )}

        {!isInitialLoading && stories.length > 0 && (
          <>
            <ul className={css.grid}>
              {stories.map((story) => (
                <StoryCard
                  key={story._id}
                  story={story}
                  isSaved={savedIds.has(story._id)}
                />
              ))}
            </ul>

            {storiesQuery.isFetchingNextPage ? (
              <div className={css.loadMoreLoader}>
                <Loader />
              </div>
            ) : (
              <Pagination
                onLoadMore={handleLoadMore}
                isLoading={false}
                hasMore={Boolean(storiesQuery.hasNextPage)}
              />
            )}
          </>
        )}
      </Container>
    </section>
  );
}