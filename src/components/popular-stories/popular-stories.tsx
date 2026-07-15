"use client";
import { Container } from "@/components/container/container";
import css from "./popular-stories.module.css";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSavedStories, getStories } from "@/lib/api/clientApi";
import { Loader } from "../loader/loader";
import StoryCard from "../story-card/story-card";
import { useAuth } from "@/providers/auth-provider";
import { useMemo } from "react";
import { Button, ButtonLink } from "../buttons/button";
import { SpriteIcon } from "../sprite-icon/sprite-icon";

export function PopularStories() {
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

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: [
      "stories",
      {
        page: 1,
        limit: 10,
        type: "popular",
      },
    ],
    queryFn: () =>
      getStories({
        page: 1,
        limit: 10,
        type: "popular",
      }),
  });
  return (
    <section className="section">
      <Container className={css.wrapper}>
        <div className={css.headingBtnWrap}>
<<<<<<< Updated upstream
          <h2 className={css.heading}>Популярні статті</h2>
          <ButtonLink href="/stories" className={css.allArticlesBtnPc}>
=======
          <h2 className={css.heading}>
            Вам також сподобається
          </h2>

          <ButtonLink
            href="/stories"
            className={css.allArticlesBtnPc}
          >
>>>>>>> Stashed changes
            Всі статті
          </ButtonLink>
        </div>
        {isLoading && (
          <div className={css.loaderWrapper}>
            <Loader />
          </div>
        )}
        {!isLoading && isSuccess && data.stories.length > 0 && (
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
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{
                  clickable: true,
                }}
                className="mySwiper"
              >
                {data.stories.map((story) => (
                  <SwiperSlide key={story._id}>
                    <StoryCard
                      story={story}
                      isSaved={savedIds.has(story._id)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className={css.navButtons}>
              <Button
                variant="secondary"
                className={`${css.navBtn} swiper-button-prev-custom`}
              >
                <SpriteIcon id="icon-arrow_back" className={css.icon}/>
              </Button>
              <Button
                variant="secondary"
                className={`${css.navBtn} swiper-button-next-custom`}
              >
                <SpriteIcon id="icon-arrow_forward" className={css.icon}/>
              </Button>
            </div>
            <ButtonLink href="/stories" className={css.allArticlesBtnMob}>
              Всі статті
            </ButtonLink>
          </>
        )}
      </Container>
    </section>
  );
}
