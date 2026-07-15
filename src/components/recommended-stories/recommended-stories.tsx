"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import StoryCard from "@/components/story-card/story-card";
import { getSavedStories } from "@/lib/api/clientApi";
import { useAuth } from "@/providers/auth-provider";
import { Story } from "@/types/story";

import styles from "./recommended-stories.module.css";

interface RecommendedStoriesProps {
  stories: Story[];
}

export function RecommendedStories({
  stories,
}: RecommendedStoriesProps) {
  const { user } = useAuth();

  const { data: savedData } = useQuery({
    queryKey: ["saved-stories"],
    queryFn: getSavedStories,
    enabled: Boolean(user),
  });

  const savedIds = useMemo(() => {
    return new Set(
      savedData?.stories.map((story) => story._id) ?? [],
    );
  }, [savedData]);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Вам також сподобається
      </h2>

      <ul className={styles.list}>
        {stories.map((story) => (
          <StoryCard
            key={story._id}
            story={story}
            isSaved={savedIds.has(story._id)}
          />
        ))}
      </ul>
    </section>
  );
}