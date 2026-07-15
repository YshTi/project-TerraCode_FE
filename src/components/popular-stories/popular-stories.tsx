"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Button, ButtonLink } from "@/components/buttons/button";
import { Container } from "@/components/container/container";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import StoryCard from "@/components/story-card/story-card";
import {
  getSavedStories,
  getStories,
} from "@/lib/api/clientApi";
import { useAuth } from "@/providers/auth-provider";

import "swiper/css";
import "swiper/css/navigation";

import css from "./popular-stories.module.css";

interface PopularStoriesProps {
  excludeStoryId?: string;
}

const MAX_VISIBLE_STORIES = 10;
const QUERY_STALE_TIME = 5 * 60 * 1000;

export function PopularStories({
  excludeStoryId,
}: PopularStoriesProps) {
  const { user } = useAuth();

  const storiesLimit = excludeStoryId
    ? MAX_VISIBLE_STORIES + 1
    : MAX_VISIBLE_STORIES;

  const savedStoriesQuery = useQuery({
    queryKey: ["saved-stories"],
    queryFn: getSavedStories,
    enabled: Boolean(user),
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const savedIds = useMemo(() => {
    return new Set(
      savedStoriesQuery.data?.stories.map(
        story => story._id,
      ) ?? [],
    );
  }, [savedStoriesQuery.data]);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: [
      "stories",
      {
        page: 1,
        limit: storiesLimit,
        type: "popular",
      },
    ],
    queryFn: () =>
      getStories({
        page: 1,
        limit: storiesLimit,
        type: "popular",
      }),
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const visibleStories = useMemo(() => {
    const stories = data?.stories ?? [];

    if (!excludeStoryId) {
      return stories.slice(0, MAX_VISIBLE_STORIES);
    }

    return stories
      .filter(story => story._id !== excludeStoryId)
      .slice(0, MAX_VISIBLE_STORIES);
  }, [data?.stories, excludeStoryId]);

  return (
    <section className="section">
      <Container className={css.wrapper}>
        <div className={css.headingBtnWrap}>
          <h2 className={css.heading}>
            Вам також сподобається
          </h2>

          <ButtonLink
            href="/stories"
            className={css.allArticlesBtnPc}
          >
            Всі статті
          </ButtonLink>
        </div>

        {isLoading && (
          <div
            className={css.skeletonGrid}
            aria-hidden="true"
          >
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <div
                  key={index}
                  className={css.skeletonCard}
                >
                  <div
                    className={css.skeletonImage}
                  />

                  <div
                    className={css.skeletonContent}
                  >
                    <div
                      className={css.skeletonMeta}
                    />
                    <div
                      className={css.skeletonTitle}
                    />
                    <div
                      className={css.skeletonTitleShort}
                    />
                    <div
                      className={css.skeletonActions}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        {isError && (
          <p className={css.errorMessage}>
            Не вдалося завантажити популярні статті.
          </p>
        )}

        {!isLoading &&
          isSuccess &&
          visibleStories.length > 0 && (
            <>
              <div className={css.swiperWrapper}>
                <Swiper
                  modules={[Navigation]}
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1440: {
                      slidesPerView: 3,
                    },
                  }}
                  spaceBetween={24}
                  navigation={{
                    nextEl:
                      ".swiper-button-next-custom",
                    prevEl:
                      ".swiper-button-prev-custom",
                  }}
                  className="mySwiper"
                >
                  {visibleStories.map(story => (
                    <SwiperSlide key={story._id}>
                      <StoryCard
                        story={story}
                        isSaved={savedIds.has(
                          story._id,
                        )}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className={css.navButtons}>
                <Button
                  type="button"
                  variant="secondary"
                  className={`${css.navBtn} swiper-button-prev-custom`}
                  aria-label="Попередня стаття"
                >
                  <SpriteIcon
                    id="icon-arrow_back"
                    className={css.icon}
                  />
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className={`${css.navBtn} swiper-button-next-custom`}
                  aria-label="Наступна стаття"
                >
                  <SpriteIcon
                    id="icon-arrow_forward"
                    className={css.icon}
                  />
                </Button>
              </div>

              <ButtonLink
                href="/stories"
                className={css.allArticlesBtnMob}
              >
                Всі статті
              </ButtonLink>
            </>
          )}
      </Container>
    </section>
  );
}