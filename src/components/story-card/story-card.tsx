"use client";

import { useState } from "react";
import Image from "next/image";

import type { Story } from "@/types/story";

import { ButtonLink } from "../buttons/button";
import { ErrorWhileSavingModal } from "../modals/error-while-saving-modal/error-while-saving-modal";
import SaveButton from "../save-button/save-button";
import { SpriteIcon } from "../sprite-icon/sprite-icon";

import css from "./story-card.module.css";

interface StoryCardProps {
  story: Story;
  isSaved: boolean;
}

type PendingSaveChange = {
  isSaved: boolean;
  rate: number;
};

export default function StoryCard({
  story,
  isSaved,
}: StoryCardProps) {
  const { _id, img, title, rate, ownerId } =
    story;

<<<<<<< Updated upstream
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedState, setSavedState] = useState(isSaved);
  const [displayRate, setDisplayRate] = useState(rate);

  const handleSavedChange = (nextIsSaved: boolean) => {
    if (nextIsSaved === savedState) {
      return;
    }

    setSavedState(nextIsSaved);

    setDisplayRate(currentRate =>
      nextIsSaved
        ? currentRate + 1
        : Math.max(0, currentRate - 1),
=======
  const [
    isAuthModalOpen,
    setIsAuthModalOpen,
  ] = useState(false);

  const [
    pendingSaveChange,
    setPendingSaveChange,
  ] = useState<PendingSaveChange | null>(
    null,
  );

  const hasServerCaughtUp =
    pendingSaveChange !== null &&
    rate === pendingSaveChange.rate;

  const effectiveIsSaved =
    pendingSaveChange &&
    !hasServerCaughtUp
      ? pendingSaveChange.isSaved
      : isSaved;

  const displayRate =
    pendingSaveChange &&
    !hasServerCaughtUp
      ? pendingSaveChange.rate
      : rate;

  const handleSavedChange = (
    nextIsSaved: boolean,
  ) => {
    if (nextIsSaved === effectiveIsSaved) {
      return;
    }

    const nextRate = Math.max(
      0,
      displayRate +
        (nextIsSaved ? 1 : -1),
>>>>>>> Stashed changes
    );

    setPendingSaveChange({
      isSaved: nextIsSaved,
      rate: nextRate,
    });
  };

  return (
    <li className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={img}
          alt={title}
          fill
          className={css.image}
<<<<<<< Updated upstream
          sizes="(max-width: 767px) 100vw, (max-width: 1439px) 340px, 421px"
=======
          sizes="
            (max-width: 767px) calc(100vw - 40px),
            (max-width: 1439px) 340px,
            421px
          "
          quality={70}
          loading={
            imagePriority
              ? "eager"
              : "lazy"
          }
          fetchPriority={
            imagePriority
              ? "high"
              : "auto"
          }
>>>>>>> Stashed changes
        />
      </div>

      <div className={css.content}>
        <p className={css.meta}>
          <span className={css.author}>
            {ownerId?.name ?? "Невідомий автор"}
          </span>

          <span className={css.dot}>
            ·
          </span>

          <span className={css.rate}>
            {displayRate}
            <SpriteIcon
              id="icon-bookmark"
              width={16}
              height={16}
            />
          </span>
        </p>

        <h3 className={css.title}>{title}</h3>

        <div className={css.actions}>
          <ButtonLink
            href={`/stories/${_id}`}
            variant="secondary"
            className={css.viewButton}
          >
            <span
              className={
                css.viewButtonText
              }
            >
              Переглянути статтю
            </span>
          </ButtonLink>

          <SaveButton
            storyId={_id}
<<<<<<< Updated upstream
            isSaved={savedState}
            onRequireAuth={() => setIsAuthModalOpen(true)}
            onSavedChange={handleSavedChange}
=======
            isSaved={effectiveIsSaved}
            onRequireAuth={() => {
              setIsAuthModalOpen(true);
            }}
            onSavedChange={
              handleSavedChange
            }
>>>>>>> Stashed changes
          />
        </div>
      </div>

      <ErrorWhileSavingModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </li>
  );
}