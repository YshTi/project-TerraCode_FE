import Image from "next/image";

import { ButtonLink } from "@/components/buttons/button";

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
  return (
    <article className={styles.card}>
      <Image
        src={avatarUrl || "/default-avatar.png"}
        alt={name}
        width={130}
        height={130}
        className={styles.photo}
      />

      <div className={styles.infoWrapper}>
        <h3 className={styles.name}>{name}</h3>

        <p className={styles.articlesCount}>
          Статей: {articlesAmount}
        </p>
      </div>

<ButtonLink
  href={`/traveller/${_id}`}
  variant="secondary"
  className={styles.linkButton}
>
  Переглянути профіль
</ButtonLink>
    </article>
  );
}