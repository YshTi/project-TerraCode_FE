"use client";

import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Container } from "@/components/container/container";
import { Loader } from "@/components/loader/loader";
import { MessageNoStories } from "@/components/message-no-stories/message-no-stories";
import { ProfileTabs } from "@/components/profile-tabs/profile-tabs";
import { TravellerInfo } from "@/components/traveller-info/traveller-info";
import { TravellersStories } from "@/components/travellers-stories/travellers-stories";
import {
  getOwnStories,
  getSavedStories,
} from "@/lib/api/profileApi";
import { useAuth } from "@/providers/auth-provider";
import { notify } from "@/utils/notify";

import css from "./page.module.css";

type ProfileTab = "saved" | "own";

const MOBILE_TABLET_LIMIT = 4;
const DESKTOP_LIMIT = 6;
const DESKTOP_MEDIA_QUERY = "(min-width: 1440px)";

function useProfileStoriesLimit() {
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

export default function ProfilePage() {
  const router = useRouter();
  const limit = useProfileStoriesLimit();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] =
    useState<ProfileTab>("saved");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/auth/login");
    }
  }, [isAuthLoading, router, user]);

  const storiesQuery = useInfiniteQuery({
    queryKey: ["profile-stories", activeTab, limit],

    queryFn: ({ pageParam }) =>
      activeTab === "saved"
        ? getSavedStories({
            page: pageParam,
            limit,
          })
        : getOwnStories({
            page: pageParam,
            limit,
          }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,

    enabled: Boolean(user),
  });

  useEffect(() => {
    if (!storiesQuery.isError) {
      return;
    }

    notify.error(
      activeTab === "saved"
        ? "Не вдалося завантажити збережені історії"
        : "Не вдалося завантажити ваші історії",
    );
  }, [activeTab, storiesQuery.isError]);

  const stories = useMemo(
    () =>
      storiesQuery.data?.pages.flatMap(
        (page) => page.stories,
      ) ?? [],
    [storiesQuery.data],
  );

  if (isAuthLoading) {
    return (
      <main className={css.main}>
        <div className={css.loaderWrapper}>
          <Loader />
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const emptyState =
    activeTab === "saved"
      ? {
          text: "У вас ще немає збережених історій.",
          buttonText: "Переглянути статті",
          linkTo: "/stories",
        }
      : {
          text: "Ви ще не створили жодної історії.",
          buttonText: "Створити історію",
          linkTo: "/stories/new",
        };

  return (
    <main className={css.main}>
      <Container>
        <TravellerInfo
          user={{
            name: user.name,
            avatarUrl: user.avatarUrl,
            articlesAmount: user.articlesAmount ?? 0,
          }}
          className={css.travellerInfo}
        />

        <ProfileTabs
          value={activeTab}
          onChange={setActiveTab}
        />

        <section className={css.storiesSection}>
          {storiesQuery.isLoading ? (
            <div className={css.loaderWrapper}>
              <Loader />
            </div>
          ) : stories.length === 0 ? (
            <MessageNoStories
              text={emptyState.text}
              buttonText={emptyState.buttonText}
              linkTo={emptyState.linkTo}
            />
          ) : (
            <TravellersStories
              stories={stories}
              savedStoryIds={
                activeTab === "saved"
                  ? stories.map((story) => story._id)
                  : []
              }
              hasMore={Boolean(storiesQuery.hasNextPage)}
              isLoadingMore={storiesQuery.isFetchingNextPage}
              onLoadMore={() => {
                void storiesQuery.fetchNextPage();
              }}
            />
          )}
        </section>
      </Container>
    </main>
  );
}