"use client";

import { useQuery } from "@tanstack/react-query";

import StoryCard from "@/components/story-card/story-card";
import { PageTitle } from "@/components/page-title/page-title";
import { getStories, getSavedStories } from "@/lib/api/clientApi";
import { useAuth } from "@/providers/auth-provider";

import css from "./page.module.css";

export default function StoriesPage() {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["stories", { page: 1, limit: 1 }],
    queryFn: () => getStories({ page: 1, limit: 1 }),
  });

  const { data: savedData } = useQuery({
    queryKey: ["saved-stories"],
    queryFn: getSavedStories,
    enabled: !!user,
  });

  if (isLoading) {
    return <p className={css.status}>Завантаження...</p>;
  }

  if (isError || !data || data.stories.length === 0) {
    return <p className={css.status}>Не вдалося завантажити статтю</p>;
  }

  const savedIds = new Set(savedData?.stories.map((s) => s._id) ?? []);
  const story = data.stories[0];

  return (
    <section className={css.section_stories}>
      <PageTitle>Статті</PageTitle>

      <ul className={css.grid}>
        <StoryCard story={story} isSaved={savedIds.has(story._id)} />
      </ul>
    </section>
  );
}