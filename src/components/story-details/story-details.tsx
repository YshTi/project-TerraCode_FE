import Image from "next/image";
import Link from "next/link";

import { PageTitle } from "@/components/page-title/page-title";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import type { StoryDetailsData } from "@/types/story";

import css from "./story-details.module.css";

interface StoryDetailsProps {
  story: StoryDetailsData;
  className?: string;
}

function formatPublicationDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export function StoryDetails({
  story,
  className = "",
}: StoryDetailsProps) {
  const publicationDate =
    formatPublicationDate(story.date);

  const authorName =
    story.owner?.name ?? "Невідомий автор";

  const categoryName =
    story.category?.category ?? "Без категорії";

  return (
    <article
      className={`${css.article} ${className}`}
    >
      <div className={css.storyInfo}>
        <div className={css.imageWrapper}>
            <Image
            src={story.img}
            alt={story.title}
            fill
            priority
            className={css.image}
            />
        </div>
        
        <div className={css.storyInfoWrapper}>   
            <Link
                href="/stories"
                className={css.backLink}
            >
                <SpriteIcon
                id="icon-chevron_left"
                width={24}
                height={24}
                className={css.backIcon}
                />

                <span className={css.backText}>Всі статті</span>
            </Link>

            <PageTitle className={css.title}>
                {story.title}
            </PageTitle>

            <div className={css.meta}>
                <div className={css.metaInfo}>
                    <span className={css.metaName}>
                    Автор статті
                    </span>
                    {authorName}
                </div>
                
                <div className={css.metaInfo}>
                    <span className={css.metaName}>
                    Опубліковано
                    </span>
                    <time dateTime={story.date}>
                        {publicationDate}
                    </time>
                </div>

                <span className={css.category}>{categoryName}</span>
            </div>
        </div> 
      </div>

      <div className={css.content}>
        <p>{story.article}</p>
      </div>
    </article>
  );
}