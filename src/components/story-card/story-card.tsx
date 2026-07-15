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
  imagePriority?: boolean;
  canEdit?: boolean;
}

type PendingSaveChange = {
  isSaved: boolean;
  rate: number;
};

export default function StoryCard({
  story,
  isSaved,
  imagePriority = false,
  canEdit = false,
}: StoryCardProps) {
  const { _id, img, title, rate, ownerId } =
    story;

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
        />

        {canEdit && (
          <ButtonLink
            href={`/stories/${_id}/edit`}
            variant="secondary"
            className={css.editButton}
            aria-label={`Редагувати історію «${title}»`}
          >
            <SpriteIcon
              id="icon-quill"
              width={20}
              height={20}
            />
          </ButtonLink>
        )}
      </div>

      <div className={css.content}>
        <p className={css.meta}>
          <span className={css.author}>
            {typeof ownerId === "object"
              ? ownerId?.name ??
                "Невідомий автор"
              : "Невідомий автор"}
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

        <h3 className={css.title}>
          {title}
        </h3>

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
            isSaved={effectiveIsSaved}
            onRequireAuth={() => {
              setIsAuthModalOpen(true);
            }}
            onSavedChange={
              handleSavedChange
            }
          />
        </div>
      </div>

      <ErrorWhileSavingModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
        }}
      />
    </li>
  );
}