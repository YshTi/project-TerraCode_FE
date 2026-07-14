"use client";

import css from "./our-travellers.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { Button } from "../buttons/button";
import { Loader } from "../loader/loader";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import { TravellerCard } from "../traveller-card/traveller-card"; 
import { getTravellers } from "@/lib/api/travellersApi";
import { Container } from "@/components/container/container"
import { notify } from "@/utils/notify";


export interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string;
  articlesAmount: number;
}


type SafeBreakpoints = {
  [width: number]: import('swiper/types').SwiperOptions & {
    grid?: { rows?: number; fill?: 'row' | 'column' }
  }
};

const swiperBreakpoints: SafeBreakpoints = {
  320: {
    slidesPerView: 1,
    slidesPerGroup: 1,
    grid: { rows: 3, fill: "row" },
    spaceBetween: 24,
  },
  768: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    grid: { rows: 2, fill: "row" },
    spaceBetween: 24,
  },
  1440: {
    slidesPerView: 4,
    slidesPerGroup: 4,
    grid: { rows: 1, fill: "row" },
    spaceBetween: 24,
  },
};

export function OurTravellers() {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [travellers, setTravellers] = useState<Traveller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTravellers = async () => {
      try {
        setLoading(true);

        const response = await getTravellers(1, 12);

        setTravellers(response.data);
      } catch (error) {
        notify.error("Не вдалося завантажити мандрівників");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchTopTravellers();
  }, []);

  return (
    <section className={css.section}>
      <Container>
        <div className={css.topWrapper}>
          <h2 className={css.title}>Наші Мандрівники</h2>
          <Link href="/travellers">
            <Button variant="primary" className={css.desktopBtn}>
              Всі мандрівники
            </Button>
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : travellers.length > 0 ? (
          <div className={css.sliderWrapper}>
            <Swiper
              modules={[Navigation, Grid]}
              navigation={{ prevEl: "#swiper-prev", nextEl: "#swiper-next" }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onInit={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              className={css.swiper}
              breakpoints={swiperBreakpoints}
            >
              {travellers.map((traveller) => (
                <SwiperSlide key={traveller._id} className={css.swiperSlide}>
                  <TravellerCard {...traveller} />
                </SwiperSlide>
              ))}
            </Swiper>

          
            <div className={css.bottomWrapper}>
              <div className={css.navigationButtons}>
                <button 
                  className={`${css.navBtn} ${isBeginning ? css.disabled : ""}`} 
                  id="swiper-prev" 
                  disabled={isBeginning}
                >
                  <SpriteIcon
                    id="icon-arrow_back"
                    width={24}
                    height={24}
                    className={css.icon}
                  />
                </button>
                <button 
                  className={`${css.navBtn} ${isEnd ? css.disabled : ""}`} 
                  id="swiper-next" 
                  disabled={isEnd}
                >
                  <SpriteIcon
                    id="icon-arrow_forward"
                    width={24}
                    height={24}
                    className={css.icon}
                  />
                </button>
              </div>
              <Link href="/travellers" className={css.mobileBtn}>
                <Button variant="primary">Всі мандрівники</Button>
              </Link>
            </div>
          </div>
        ) : (
          <p className={css.emptyMessage}>Мандрівників поки не знайдено.</p>
        )}
      </Container>
    </section>
  );
}

