"use client";

import { useMemo } from "react";

import { Loader } from "@/components/loader/loader";
import { Pagination } from "@/components/pagination/pagination";
import StoryCard from "@/components/story-card/story-card";
import type { Story } from "@/types/story";

import css from "./travellers-stories.module.css";

interface TravellersStoriesProps {
  stories: Story[];
  savedStoryIds?: string[];
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  className?: string;
}

export function TravellersStories({
  stories,
  savedStoryIds = [],
  hasMore,
  isLoadingMore,
  onLoadMore,
  className = "",
}: TravellersStoriesProps) {
  const savedIds = useMemo(
    () => new Set(savedStoryIds),
    [savedStoryIds],
  );

  return (
    <div className={`${css.wrapper} ${className}`}>
      <ul className={css.list}>
        {stories.map((story) => (
          <StoryCard
            key={story._id}
            story={story}
            isSaved={savedIds.has(story._id)}
          />
        ))}
      </ul>

      {isLoadingMore ? (
        <div className={css.loaderWrapper}>
          <Loader />
        </div>
      ) : (
        <Pagination
          onLoadMore={onLoadMore}
          isLoading={isLoadingMore}
          hasMore={hasMore}
          fullWidthOnMobile
        />
      )}
    </div>
  );
}