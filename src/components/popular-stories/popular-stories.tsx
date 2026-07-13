"use client";
import { Container } from "@/components/container/container";
import css from "./popular-stories.module.css";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSavedStories, getStories } from "@/lib/api/clientApi";
import { Loader } from "../loader/loader";
import StoryCard from "../story-card/story-card";
import { useAuth } from "@/providers/auth-provider";
import { useMemo } from "react";

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
        <h2 className={css.heading}>Популярні статті</h2>
        {isLoading && (
          <div className={css.loaderWrapper}>
            <Loader />
          </div>
        )}
        {!isLoading && isSuccess && data.stories.length > 0 && (
          <Swiper
            modules={[Navigation]}
            slidesPerView={3}
            spaceBetween={24}
            navigation
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
          >
            {data.stories.map((story) => (
              <SwiperSlide key={story._id}>
                <StoryCard
                  key={story._id}
                  story={story}
                  isSaved={savedIds.has(story._id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>
    </section>
  );
}
