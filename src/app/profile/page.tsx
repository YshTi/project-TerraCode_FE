"use client";

import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button, ButtonLink } from "@/components/buttons/button";
import { Container } from "@/components/container/container";
import { Loader } from "@/components/loader/loader";
import { MessageNoStories } from "@/components/message-no-stories/message-no-stories";
import { ProfileTabs } from "@/components/profile-tabs/profile-tabs";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
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

const STORIES_LIMIT = 6;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [activeTab, setActiveTab] =
    useState<ProfileTab>("saved");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/auth/login");
    }
  }, [isAuthLoading, router, user]);

  const storiesQuery = useInfiniteQuery({
    queryKey: ["profile-stories", activeTab],

    queryFn: ({ pageParam }) =>
      activeTab === "saved"
        ? getSavedStories({
            page: pageParam,
            limit: STORIES_LIMIT,
          })
        : getOwnStories({
            page: pageParam,
            limit: STORIES_LIMIT,
          }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;

      if (!pagination) {
        return undefined;
      }

      return pagination.page < pagination.totalPages
        ? pagination.page + 1
        : undefined;
    },

    enabled: Boolean(user),
  });

  useEffect(() => {
    if (!storiesQuery.error) {
      return;
    }

    notify.error(
      activeTab === "saved"
        ? "Не вдалося завантажити збережені історії"
        : "Не вдалося завантажити ваші історії",
    );
  }, [activeTab, storiesQuery.error]);

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

  const handleLoadMore = () => {
    if (
      storiesQuery.hasNextPage &&
      !storiesQuery.isFetchingNextPage
    ) {
      void storiesQuery.fetchNextPage();
    }
  };

  return (
    <main className={css.main}>
      <Container>
        <div className={css.profileHeader}>
          <TravellerInfo
            user={{
              name: user.name,
              avatarUrl: user.avatarUrl,
              articlesAmount: user.articlesAmount ?? 0,
            }}
            className={css.travellerInfo}
          />

          <div className={css.editProfileWrapper}>
            <ButtonLink
              href="/profile/edit"
              variant="secondary"
              className={css.editProfileButton}
              aria-label="Редагувати профіль"
            >
              <SpriteIcon
                id="icon-quill"
                width={18}
                height={18}
                className={css.editProfileIcon}
              />
            </ButtonLink>

            <span
              className={css.editProfileTooltip}
              role="tooltip"
            >
              Редагувати профіль
            </span>
          </div>
        </div>

        <ProfileTabs
          value={activeTab}
          onChange={setActiveTab}
        />

        <section className={css.storiesSection}>
          {storiesQuery.isLoading ? (
            <div className={css.loaderWrapper}>
              <Loader />
            </div>
          ) : storiesQuery.isError ? (
            <div className={css.errorState}>
              <p className={css.errorText}>
                Не вдалося завантажити історії.
              </p>

              <Button
                type="button"
                variant="primary"
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
              onLoadMore={handleLoadMore}
            />
          )}
        </section>
      </Container>
    </main>
  );
}