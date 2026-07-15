"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Loader } from "@/components/loader/loader";
import { Pagination } from "@/components/pagination/pagination";
import { TravellerCard } from "@/components/traveller-card/traveller-card";
import { getTravellers } from "@/lib/api/travellersApi";
import type { User } from "@/types/user";

import css from "./travellers-list.module.css";

const LIMIT = 12;

function getUniqueTravellers(travellers: User[]): User[] {
  return Array.from(
    new Map(
      travellers.map((traveller) => [
        traveller._id,
        traveller,
      ]),
    ).values(),
  );
}

export default function TravellersList() {
  const [travellers, setTravellers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] =
    useState(true);
  const [isLoadingMore, setIsLoadingMore] =
    useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadInitialTravellers = async () => {
      setIsInitialLoading(true);
      setHasError(false);

      try {
        const response = await getTravellers(1, LIMIT);

        setTravellers(
          getUniqueTravellers(response.data ?? []),
        );

        setPage(response.pagination.page);

        setHasMore(
          response.pagination.page <
            response.pagination.totalPages,
        );
      } catch (error) {
        console.error(
          "Не вдалося завантажити мандрівників:",
          error,
        );

        setHasError(true);

        toast.error(
          "Не вдалося завантажити мандрівників з сервера.",
        );
      } finally {
        setIsInitialLoading(false);
      }
    };

    void loadInitialTravellers();
  }, []);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    const nextPage = page + 1;

    setIsLoadingMore(true);

    try {
      const response = await getTravellers(
        nextPage,
        LIMIT,
      );

      setTravellers((currentTravellers) =>
        getUniqueTravellers([
          ...currentTravellers,
          ...(response.data ?? []),
        ]),
      );

      setPage(response.pagination.page);

      setHasMore(
        response.pagination.page <
          response.pagination.totalPages,
      );
    } catch (error) {
      console.error(
        "Не вдалося завантажити наступну сторінку:",
        error,
      );

      toast.error(
        "Не вдалося завантажити мандрівників. Спробуйте ще раз!",
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className={css.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={css.errorState}>
        <p>
          Не вдалося завантажити мандрівників.
          Оновіть сторінку та спробуйте ще раз.
        </p>
      </div>
    );
  }

  if (travellers.length === 0) {
    return (
      <p className={css.emptyText}>
        Мандрівників не знайдено...
      </p>
    );
  }

  return (
    <div className={css.container}>
      <ul className={css.travellersList}>
        {travellers.map((traveller) => (
          <li
            key={traveller._id}
            className={css.item}
          >
            <TravellerCard {...traveller} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <Pagination
          onLoadMore={() => {
            void loadMore();
          }}
          isLoading={isLoadingMore}
          hasMore={hasMore}
        />
      )}
    </div>
  );
}