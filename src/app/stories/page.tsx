"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CategoriesFilter } from "@/components/categories-filter/categories-filter";
import { Container } from "@/components/container/container";
import { Loader } from "@/components/loader/loader";
import { PageTitle } from "@/components/page-title/page-title";
import StoryCard from "@/components/story-card/story-card";
import {
  getCategories,
  getSavedStories,
  getStories,
} from "@/lib/api/clientApi";
import { useAuth } from "@/providers/auth-provider";
import { notify } from "@/utils/notify";

import css from "./page.module.css";

const LIMIT = 9;

export default function StoriesPage() {
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const storiesQuery = useQuery({
    queryKey: [
      "stories",
      {
        page: 1,
        limit: LIMIT,
        category: selectedCategory,
      },
    ],
    queryFn: () =>
      getStories({
        page: 1,
        limit: LIMIT,
        category: selectedCategory ?? undefined,
      }),
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
      savedStoriesQuery.data?.stories.map((story) => story._id) ?? [],
    );
  }, [savedStoriesQuery.data]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const isLoading =
    categoriesQuery.isLoading || storiesQuery.isFetching;

  const stories = storiesQuery.data?.stories ?? [];

  return (
    <section className={css.section}>
      <Container>
        <PageTitle>Статті</PageTitle>

        <CategoriesFilter
          categories={categoriesQuery.data ?? []}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          disabled={storiesQuery.isFetching}
        />

        {isLoading && (
          <div className={css.loaderWrapper}>
            <Loader />
          </div>
        )}

        {!isLoading &&
          storiesQuery.isSuccess &&
          stories.length === 0 && (
            <p className={css.empty}>
              У цій категорії немає статей
            </p>
          )}

        {!isLoading && stories.length > 0 && (
          <ul className={css.grid}>
            {stories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                isSaved={savedIds.has(story._id)}
              />
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}