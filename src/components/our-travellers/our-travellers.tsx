"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ButtonLink, Button } from "@/components/buttons/button";
import { Container } from "@/components/container/container";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import { TravellerCard } from "@/components/traveller-card/traveller-card";
import { getTravellers } from "@/lib/api/travellersApi";
import { notify } from "@/utils/notify";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";

import css from "./our-travellers.module.css";

export interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string;
  articlesAmount: number;
}

type SafeBreakpoints = {
  [width: number]: import("swiper/types").SwiperOptions & {
    grid?: {
      rows?: number;
      fill?: "row" | "column";
    };
  };
};

const swiperBreakpoints: SafeBreakpoints = {
  320: {
    slidesPerView: 1,
    slidesPerGroup: 1,
    grid: {
      rows: 3,
      fill: "row",
    },
    spaceBetween: 24,
  },

  768: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    grid: {
      rows: 2,
      fill: "row",
    },
    spaceBetween: 24,
  },

  1440: {
    slidesPerView: 4,
    slidesPerGroup: 4,
    grid: {
      rows: 1,
      fill: "row",
    },
    spaceBetween: 24,
  },
};

const QUERY_STALE_TIME = 5 * 60 * 1000;

export function OurTravellers() {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const travellersQuery = useQuery({
    queryKey: ["travellers", { page: 1, limit: 12 }],
    queryFn: () => getTravellers(1, 12),
    staleTime: QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const travellers = travellersQuery.data?.data ?? [];

  if (travellersQuery.isError) {
    notify.error("Не вдалося завантажити мандрівників");
  }

  return (
    <section className={css.section}>
      <Container>
        <div className={css.topWrapper}>
          <h2 className={css.title}>
            Наші Мандрівники
          </h2>

          <ButtonLink
            href="/travellers"
            variant="primary"
            className={css.desktopBtn}
          >
            Всі мандрівники
          </ButtonLink>
        </div>

        {travellersQuery.isLoading && (
          <div
            className={css.skeletonGrid}
            aria-hidden="true"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={css.skeletonCard}
              >
                <div className={css.skeletonAvatar} />

                <div className={css.skeletonName} />

                <div className={css.skeletonMeta} />
              </div>
            ))}
          </div>
        )}

        {!travellersQuery.isLoading &&
          travellersQuery.isError && (
            <div className={css.errorState}>
              <p className={css.emptyMessage}>
                Не вдалося завантажити мандрівників.
              </p>

              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  void travellersQuery.refetch();
                }}
                disabled={travellersQuery.isFetching}
              >
                {travellersQuery.isFetching
                  ? "Повторне завантаження..."
                  : "Спробувати ще раз"}
              </Button>
            </div>
          )}

        {!travellersQuery.isLoading &&
          travellersQuery.isSuccess &&
          travellers.length > 0 && (
            <div className={css.sliderWrapper}>
              <Swiper
                modules={[Navigation, Grid]}
                navigation={{
                  prevEl: "#swiper-prev",
                  nextEl: "#swiper-next",
                }}
                onSlideChange={swiper => {
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }}
                onInit={swiper => {
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }}
                className={css.swiper}
                breakpoints={swiperBreakpoints}
              >
                {travellers.map(traveller => (
                  <SwiperSlide
                    key={traveller._id}
                    className={css.swiperSlide}
                  >
                    <TravellerCard {...traveller} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className={css.bottomWrapper}>
                <div className={css.navigationButtons}>
                  <button
                    type="button"
                    className={`${css.navBtn} ${
                      isBeginning ? css.disabled : ""
                    }`}
                    id="swiper-prev"
                    disabled={isBeginning}
                    aria-label="Попередні мандрівники"
                  >
                    <SpriteIcon
                      id="icon-arrow_back"
                      width={24}
                      height={24}
                      className={css.icon}
                    />
                  </button>

                  <button
                    type="button"
                    className={`${css.navBtn} ${
                      isEnd ? css.disabled : ""
                    }`}
                    id="swiper-next"
                    disabled={isEnd}
                    aria-label="Наступні мандрівники"
                  >
                    <SpriteIcon
                      id="icon-arrow_forward"
                      width={24}
                      height={24}
                      className={css.icon}
                    />
                  </button>
                </div>

                <ButtonLink
                  href="/travellers"
                  variant="primary"
                  className={css.mobileBtn}
                >
                  Всі мандрівники
                </ButtonLink>
              </div>
            </div>
          )}

        {!travellersQuery.isLoading &&
          travellersQuery.isSuccess &&
          travellers.length === 0 && (
            <p className={css.emptyMessage}>
              Мандрівників поки не знайдено.
            </p>
          )}
      </Container>
    </section>
  );
}