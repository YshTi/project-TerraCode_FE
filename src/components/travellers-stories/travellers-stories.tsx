"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Button } from "@/components/buttons/button";
import { Loader } from "@/components/loader/loader";
import { MessageNoStories } from "@/components/message-no-stories/message-no-stories";
import { Pagination } from "@/components/pagination/pagination";
import StoryCard from "@/components/story-card/story-card";
import {
  getOwnStories,
  getSavedStories,
} from "@/lib/api/profileApi";
import { getTravellerStories } from "@/lib/api/travellersApi";
import { notify } from "@/utils/notify";

import css from "./travellers-stories.module.css";

type PublicStoriesSource = {
  type: "public";
  userId: string;
};

type PrivateStoriesSource = {
  type: "own" | "saved";
};

type StoriesSource =
  | PublicStoriesSource
  | PrivateStoriesSource;

interface EmptyStateProps {
  text: string;
  buttonText: string;
  linkTo: string;
}

interface TravellersStoriesProps {
  source: StoriesSource;
  emptyState: EmptyStateProps;
  limit?: number;
  savedStoryIds?: string[];
  className?: string;
}

export function TravellersStories({
  source,
  emptyState,
  limit = 6,
  savedStoryIds = [],
  className = "",
}: TravellersStoriesProps) {
  const listRef = useRef<HTMLUListElement | null>(null);

  const queryKey =
    source.type === "public"
      ? ([
          "traveller-stories",
          source.userId,
          limit,
        ] as const)
      : ([
          "profile-stories",
          source.type,
          limit,
        ] as const);

  const storiesQuery = useInfiniteQuery({
    queryKey,

    queryFn: ({ pageParam }) => {
      if (source.type === "public") {
        return getTravellerStories({
          userId: source.userId,
          page: pageParam,
          limit,
        });
      }

      if (source.type === "saved") {
        return getSavedStories({
          page: pageParam,
          limit,
        });
      }

      return getOwnStories({
        page: pageParam,
        limit,
      });
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;

      if (!pagination) {
        return undefined;
      }

      const hasNextPage =
        "hasNextPage" in pagination
          ? pagination.hasNextPage
          : pagination.page < pagination.totalPages;

      return hasNextPage
        ? pagination.page + 1
        : undefined;
    },

    enabled:
      source.type !== "public" ||
      Boolean(source.userId),
  });

  useEffect(() => {
    if (!storiesQuery.isError) {
      return;
    }

    const errorMessage =
      source.type === "saved"
        ? "Не вдалося завантажити збережені історії"
        : source.type === "own"
          ? "Не вдалося завантажити ваші історії"
          : "Не вдалося завантажити історії мандрівника";

    notify.error(errorMessage);
  }, [source.type, storiesQuery.isError]);

  const stories = useMemo(
    () =>
      storiesQuery.data?.pages.flatMap(
        (page) => page.stories,
      ) ?? [],
    [storiesQuery.data],
  );

  const savedIds = useMemo(() => {
    if (source.type === "saved") {
      return new Set(
        stories.map((story) => story._id),
      );
    }

    return new Set(savedStoryIds);
  }, [savedStoryIds, source.type, stories]);

  const handleLoadMore = async () => {
    if (
      !storiesQuery.hasNextPage ||
      storiesQuery.isFetchingNextPage
    ) {
      return;
    }

    const previousStoriesCount = stories.length;

    const result = await storiesQuery.fetchNextPage();

    if (result.isError) {
      return;
    }

    requestAnimationFrame(() => {
      const firstNewStory =
        listRef.current?.children.item(
          previousStoriesCount,
        );

      firstNewStory?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  if (storiesQuery.isLoading) {
    return (
      <div className={css.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  if (storiesQuery.isError) {
    return (
      <div className={css.errorState}>
        <p className={css.errorText}>
          Не вдалося завантажити історії.
        </p>

        <Button
          type="button"
          onClick={() => {
            void storiesQuery.refetch();
          }}
          disabled={storiesQuery.isFetching}
        >
          {storiesQuery.isFetching
            ? "Повторне завантаження..."
            : "Спробувати ще раз"}
        </Button>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <MessageNoStories
        text={emptyState.text}
        buttonText={emptyState.buttonText}
        linkTo={emptyState.linkTo}
      />
    );
  }

  return (
    <div
      className={`${css.wrapper} ${className}`.trim()}
    >
      <ul
        ref={listRef}
        className={css.list}
      >
        {stories.map((story) => (
          <StoryCard
            key={story._id}
            story={story}
            isSaved={savedIds.has(story._id)}
          />
        ))}
      </ul>

      {storiesQuery.isFetchingNextPage && (
        <div className={css.loaderWrapper}>
          <Loader />
        </div>
      )}

      {!storiesQuery.isFetchingNextPage &&
        storiesQuery.hasNextPage && (
          <Pagination
            onLoadMore={() => {
              void handleLoadMore();
            }}
            isLoading={
              storiesQuery.isFetchingNextPage
            }
            hasMore={Boolean(
              storiesQuery.hasNextPage,
            )}
            fullWidthOnMobile
          />
        )}
    </div>
  );
}