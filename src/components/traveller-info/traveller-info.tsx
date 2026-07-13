import Image from "next/image";
import css from "./traveller-info.module.css";
import { DEFAULT_AVATAR_URL } from "@/constants/user";

interface TravellerInfoProps {
  user: {
    avatarUrl: string;
    name: string;
    articlesAmount: number;
  };
}

export function TravellerInfo({ user }: TravellerInfoProps) {
  return (
    <div className={css.wrapper}>
      <Image
        className={css.avatar}
        src={user.avatarUrl || DEFAULT_AVATAR_URL}
        alt={user.name}
        width={113}
        height={113}
      />
      <div>
        <p className={css.username}>{user.name}</p>
        <p className={css.articles}>Статей: {user.articlesAmount}</p>
      </div>
    </div>
  );
}
