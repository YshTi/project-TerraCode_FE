import Image from "next/image";
import { Container } from "../container/container";
import css from "./traveller-info.module.css";

interface TravellerInfoProps {
  user: {
    avatarUrl: string;
    name: string;
    articlesAmount: number;
  };
}

export function TravellerInfo({ user }: TravellerInfoProps) {
  return (
    <section>
      <Container>
        <div>
          <Image
            className={css.avatar}
            src={user.avatarUrl}
            alt={user.name}
            width={113}
            height={113}
          />
          <div></div>
        </div>
      </Container>
    </section>
  );
}
