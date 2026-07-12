"use client";

import { useState } from "react";
import Image from "next/image";

import { ButtonLink } from "../buttons/button";
import { Story } from "@/types/story";
import { SpriteIcon } from "../sprite-icon/sprite-icon";
import SaveButton from "../save-button/save-button";
import { ErrorWhileSavingModal } from "../modals/error-while-saving-modal/error-while-saving-modal";

import css from "./story-card1.module.css";

interface StoryCardProps {
  story: Story;
  isSaved: boolean;
}

export default function StoryCard({ story, isSaved }: StoryCardProps) {
  const { _id, img, title, rate, ownerId } = story;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <li className={css.card}>
      <div className={css.imageWrapper}>
        <Image
          src={img}
          alt={title}
          fill
          className={css.image}
          sizes="(max-width: 767px) 100vw, (max-width: 1439px) 340px, 421px"
        />
      </div>

      <div className={css.content}>
        <p className={css.meta}>
          <span className={css.author}>
            {ownerId?.name ?? "Невідомий автор"}
          </span>
          <span className={css.dot}>·</span>
          <span className={css.rate}>
            {rate}
            <SpriteIcon id="icon-bookmark" width={16} height={16} />
          </span>
        </p>

        <h3 className={css.title}>{title}</h3>

        <div className={css.actions}>
          <ButtonLink
            href={`/stories/${_id}`}
            variant="secondary"
            className={css.viewButton}
          >
            <span className={css.viewButtonText}>Переглянути статтю</span>
          </ButtonLink>

          <SaveButton
            storyId={_id}
            isSaved={isSaved}
            onRequireAuth={() => setIsAuthModalOpen(true)}
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
