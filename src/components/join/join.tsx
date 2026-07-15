"use client";

import Image from "next/image";

import { ButtonLink } from "@/components/buttons/button";
import { Container } from "@/components/container/container";
import { useAuth } from "@/providers/auth-provider";

import joinBackground from "../../../public/images/join-bg.webp";

import styles from "./join.module.css";

export function Join() {
  const { user, isLoading } = useAuth();

  const isAuthenticated = Boolean(user);

  const href = isAuthenticated
    ? "/profile/saved"
    : "/auth/register";

  const buttonText = isAuthenticated
    ? "Збережені статті"
    : "Зареєструватися";

  const title = isAuthenticated
    ? "Ваші збережені статті"
    : "Приєднуйся до спільноти свідомих мандрівників";

  const description = isAuthenticated
    ? "Ви вже є частиною спільноти свідомих мандрівників. Ваші збережені статті завжди доступні в особистому профілі."
    : "Стань частиною ком’юніті, де подорожі стають не лише пригодою, а й внеском у збереження природи. Тут ти знайдеш однодумців, поради для сталих мандрів та натхнення для нових маршрутів Україною.";

  return (
    <section id="Join" className="section">
      <Container>
        <div className={styles.card}>
          <Image
            src={joinBackground}
            alt=""
            fill
            className={styles.backgroundImage}
            sizes="
              (max-width: 767px) calc(100vw - 40px),
              (max-width: 1439px) calc(100vw - 64px),
              1312px
            "
            quality={70}
            placeholder="blur"
          />

          <div className={styles.column}>
            <div className={styles.content}>
              <h2 className={styles.title}>
                {title}
              </h2>

              <p className={styles.text}>
                {description}
              </p>
            </div>

            <div className={styles.actions}>
              {isLoading ? (
                <div
                  className={styles.buttonPlaceholder}
                  aria-hidden="true"
                />
              ) : (
                <ButtonLink
                  href={href}
                  className={styles.button}
                >
                  {buttonText}
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}