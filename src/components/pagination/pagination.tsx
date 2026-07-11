"use client";

import { Button } from "../buttons/button";
import css from "./pagination.module.css";

interface PaginationProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function Pagination({ onLoadMore, isLoading, hasMore }: PaginationProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className={css.wrapper}>
      <Button
        type="button"
        variant="primary"
        onClick={onLoadMore}
        className={css.button}
        disabled={isLoading}
      >
        {isLoading ? "Завантаження..." : "Показати ще"}
      </Button>
    </div>
  );
}