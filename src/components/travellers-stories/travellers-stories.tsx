"use client";

import { useMemo } from "react";

import StoryCard from "@/components/story-card/story-card";
import type { Story } from "@/types/story";

import css from "./travellers-stories.module.css";

interface TravellersStoriesProps {
  stories: Story[];
  savedStoryIds?: string[];
  className?: string;
}

export function TravellersStories({
  stories,
  savedStoryIds = [],
  className = "",
}: TravellersStoriesProps) {
  const savedIds = useMemo(
    () => new Set(savedStoryIds),
    [savedStoryIds],
  );

  return (
    <ul className={`${css.list} ${className}`}>
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