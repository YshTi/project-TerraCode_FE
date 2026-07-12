"use client";

import { Button } from "@/components/buttons/button";
import { Loader } from "@/components/loader/loader";

import styles from "./pagination.module.css";

type PaginationProps = {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  fullWidthOnMobile?: boolean;
};

export function Pagination({
  onLoadMore,
  isLoading,
  hasMore,
  fullWidthOnMobile = false,
}: PaginationProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <Button
        type="button"
        variant="primary"
        onClick={onLoadMore}
        disabled={isLoading}
        className={`${styles.button} ${
          fullWidthOnMobile ? styles.fullWidthOnMobile : ""
        }`}
      >
        {isLoading ? <Loader /> : "Показати ще"}
      </Button>
    </div>
  );
}