"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { MessageNoStories } from "@/components/message-no-stories/message-no-stories";
import StoryCard from "@/components/story-card/story-card";
import { getSavedStories } from "@/lib/api/clientApi";
import { useAuth } from "@/providers/auth-provider";
import type { Story } from "@/types/story";

import styles from "./travellers-stories.module.css";

type TravellersStoriesProps = {
  stories: Story[];
};

export function TravellersStories({ stories }: TravellersStoriesProps) {
  const { user } = useAuth();

  const savedStoriesQuery = useQuery({
    queryKey: ["saved-stories"],
    queryFn: getSavedStories,
    enabled: Boolean(user),
  });

  const savedIds = useMemo(() => {
    return new Set(
      savedStoriesQuery.data?.stories.map((story) => story._id) ?? [],
    );
  }, [savedStoriesQuery.data]);

  if (stories.length === 0) {
    return (
      <MessageNoStories
        text="Цей користувач ще не публікував історій"
        buttonText="Назад до історій"
        linkTo="/stories"
      />
    );
  }

  return (
    <ul className={styles.list}>
      {stories.map((story) => (
        <StoryCard
          key={story._id}
          story={story}
          isSaved={savedIds.has(story._id)}
        />
      ))}
    </ul>
  );
}