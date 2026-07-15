import Image from "next/image";

import { ButtonLink } from "@/components/buttons/button";
import { DEFAULT_AVATAR_URL } from "@/constants/user";

import styles from "./traveller-card.module.css";

type TravellerCardProps = {
  _id: string;
  name: string;
  avatarUrl?: string;
  articlesAmount: number;
};

export function TravellerCard({
  _id,
  name,
  avatarUrl,
  articlesAmount,
}: TravellerCardProps) {
  const imageSrc = avatarUrl || DEFAULT_AVATAR_URL;

  return (
    <article className={styles.card}>
      <div className={styles.photoWrapper}>
        <Image
          src={imageSrc}
          alt={`Фото мандрівника ${name}`}
          width={130}
          height={130}
          sizes="130px"
          quality={70}
          className={styles.photo}
        />
      </div>

      <div className={styles.infoWrapper}>
        <h3 className={styles.name}>
          {name}
        </h3>

        <p className={styles.articlesCount}>
          Статей: {articlesAmount}
        </p>
      </div>

      <ButtonLink
        href={`/travellers/${_id}`}
        variant="secondary"
        className={styles.linkButton}
      >
        Переглянути профіль
      </ButtonLink>
    </article>
  );
}