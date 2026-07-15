"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  useInfiniteQuery,
  useQueries,
  useQuery,
} from "@tanstack/react-query";

import { Button } from "@/components/buttons/button";
import { Loader } from "@/components/loader/loader";
import { MessageNoStories } from "@/components/message-no-stories/message-no-stories";
import { Pagination } from "@/components/pagination/pagination";
import StoryCard from "@/components/story-card/story-card";
import {
  getOwnStories,
  getSavedStories as getSavedProfileStories,
} from "@/lib/api/profileApi";
import { getSavedStories as getSavedStoriesForStatus } from "@/lib/api/clientApi";
import {
  getTravellerById,
  getTravellerStories,
} from "@/lib/api/travellersApi";
import { useAuth } from "@/providers/auth-provider";
import type { Story } from "@/types/story";
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

const STALE_TIME = 5 * 60 * 1000;
const OWNER_STALE_TIME = 10 * 60 * 1000;

function hasPopulatedOwner(
  ownerId: Story["ownerId"] | string | null | undefined,
): ownerId is Exclude<Story["ownerId"], string | null | undefined> {
  return (
    typeof ownerId === "object" &&
    ownerId !== null &&
    "name" in ownerId &&
    typeof ownerId.name === "string" &&
    ownerId.name.trim().length > 0
  );
}

export function TravellersStories({
  source,
  emptyState,
  limit = 6,
  savedStoryIds = [],
  className = "",
}: TravellersStoriesProps) {
  const { user } = useAuth();

  const listRef =
    useRef<HTMLUListElement | null>(null);
  
  const savedStatusQuery = useQuery({
    queryKey: ["saved-stories"],
    queryFn: getSavedStoriesForStatus,
    enabled: Boolean(user) && source.type !== "saved",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

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

    queryFn: async ({ pageParam }) => {
      if (source.type === "public") {
        return getTravellerStories({
          userId: source.userId,
          page: pageParam,
          limit,
        });
      }

      if (source.type === "saved") {
        return getSavedProfileStories({
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

    getNextPageParam: lastPage => {
      const { pagination } = lastPage;

      if (!pagination) {
        return undefined;
      }

      const hasNextPage =
        "hasNextPage" in pagination
          ? pagination.hasNextPage
          : pagination.page <
            pagination.totalPages;

      return hasNextPage
        ? pagination.page + 1
        : undefined;
    },

    enabled:
      source.type !== "public" ||
      Boolean(source.userId),

    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
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

  const stories = useMemo(() => {
    return (
      storiesQuery.data?.pages.flatMap(
        page => page.stories,
      ) ?? []
    );
  }, [storiesQuery.data]);

  const savedOwnerIds = useMemo(() => {
    if (source.type !== "saved") {
      return [];
    }

    const ownerIds = stories
      .map(story => {
        const owner = story.ownerId as unknown;

        return typeof owner === "string"
          ? owner
          : null;
      })
      .filter(
        (ownerId): ownerId is string =>
          Boolean(ownerId),
      );

    return Array.from(new Set(ownerIds));
  }, [source.type, stories]);

  const ownerQueries = useQueries({
    queries: savedOwnerIds.map(ownerId => ({
      queryKey: ["traveller", ownerId],
      queryFn: () => getTravellerById(ownerId),
      staleTime: OWNER_STALE_TIME,
      refetchOnWindowFocus: false,
    })),
  });

  const ownerNamesById = useMemo(() => {
    const map = new Map<
      string,
      {
        _id: string;
        name: string;
        avatarUrl?: string;
      }
    >();

    ownerQueries.forEach((query, index) => {
      const ownerId = savedOwnerIds[index];
      const owner = query.data;

      if (!ownerId || !owner?.name) {
        return;
      }

      map.set(ownerId, {
        _id: owner._id,
        name: owner.name,
        avatarUrl: owner.avatarUrl ?? "",
      });
    });

    return map;
  }, [ownerQueries, savedOwnerIds]);

  const resolvedStories = useMemo(() => {
    return stories.map(story => {
      const currentOwner = story.ownerId as unknown;

      if (
        hasPopulatedOwner(
          currentOwner as Story["ownerId"],
        )
      ) {
        return story;
      }

      if (
        source.type === "own" &&
        user
      ) {
        return {
          ...story,
          ownerId: {
            _id:
              typeof currentOwner === "string"
                ? currentOwner
                : user.id,
            name: user.name,
            avatarUrl: user.avatarUrl ?? "",
          },
        } as Story;
      }

      if (
        source.type === "saved" &&
        typeof currentOwner === "string"
      ) {
        const savedOwner =
          ownerNamesById.get(currentOwner);

        if (savedOwner) {
          return {
            ...story,
            ownerId: savedOwner,
          } as Story;
        }
      }

      return story;
    });
  }, [
    ownerNamesById,
    source.type,
    stories,
    user,
  ]);

  const savedIds = useMemo(() => {
    if (source.type === "saved") {
      return new Set(stories.map((story) => story._id));
    }

    const idsFromQuery =
      savedStatusQuery.data?.stories.map(
        (story) => story._id,
      ) ?? [];

    return new Set([
      ...savedStoryIds,
      ...idsFromQuery,
    ]);
  }, [
    savedStatusQuery.data,
    savedStoryIds,
    source.type,
    stories,
  ]);

  const areSavedOwnersLoading =
    source.type === "saved" &&
    ownerQueries.some(query => query.isLoading);

  const handleLoadMore = async () => {
    if (
      !storiesQuery.hasNextPage ||
      storiesQuery.isFetchingNextPage
    ) {
      return;
    }

    const previousStoriesCount =
      stories.length;

    const result =
      await storiesQuery.fetchNextPage();

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

  if (
    storiesQuery.isLoading ||
    areSavedOwnersLoading
  ) {
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
          disabled={
            storiesQuery.isFetching
          }
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
        buttonText={
          emptyState.buttonText
        }
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
        {resolvedStories.map((story, index) => (
            <StoryCard
              key={story._id}
              story={story}
              isSaved={savedIds.has(story._id,)}
              imagePriority={index === 0}
              canEdit={source.type === "own"}
            />
          ),
        )}
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