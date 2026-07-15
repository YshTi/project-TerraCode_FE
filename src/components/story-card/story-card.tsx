"use client";

import { useState } from "react";
import Image from "next/image";

import { Story } from "@/types/story";

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

export default function StoryCard({
  story,
  isSaved,
  imagePriority = false,
  canEdit = false,
}: StoryCardProps) {
  const { _id, img, title, rate, ownerId } = story;

  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  /*
   * null means: use the current isSaved prop.
   * After a successful user action, temporarily use the
   * locally selected state.
   */
  const [savedOverride, setSavedOverride] =
    useState<boolean | null>(null);

  const [rateChange, setRateChange] = useState(0);

  const effectiveIsSaved =
    savedOverride ?? isSaved;

  const displayRate = Math.max(
    0,
    rate + rateChange,
  );

  const handleSavedChange = (
    nextIsSaved: boolean,
  ) => {
    if (nextIsSaved === effectiveIsSaved) {
      return;
    }

    setSavedOverride(nextIsSaved);

    setRateChange(currentChange =>
      nextIsSaved
        ? currentChange + 1
        : currentChange - 1,
    );
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
          loading={imagePriority ? "eager" : "lazy"}
          fetchPriority={imagePriority ? "high" : "auto"}
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

          <span className={css.dot}>·</span>

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
            <span className={css.viewButtonText}>
              Переглянути статтю
            </span>
          </ButtonLink>

          <SaveButton
            storyId={_id}
            isSaved={effectiveIsSaved}
            onRequireAuth={() => {
              setIsAuthModalOpen(true);
            }}
            onSavedChange={handleSavedChange}
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