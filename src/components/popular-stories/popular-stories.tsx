"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Button, ButtonLink } from "@/components/buttons/button";
import { Container } from "@/components/container/container";
import { Loader } from "@/components/loader/loader";
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
            Популярні статті
          </h2>

          <ButtonLink
            href="/stories"
            className={css.allArticlesBtnPc}
          >
            Всі статті
          </ButtonLink>
        </div>

        {isLoading && (
          <div className={css.loaderWrapper}>
            <Loader />
          </div>
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