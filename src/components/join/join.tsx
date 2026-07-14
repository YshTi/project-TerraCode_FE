"use client";

import { ButtonLink } from "@/components/buttons/button";
import { Container } from "@/components/container/container";
import { useAuth } from "@/providers/auth-provider";

import styles from "./join.module.css";

export function Join() {
  const { user, isLoading } = useAuth();

  const href = user ? "/profile/saved" : "/auth/register";
  const buttonText = user ? "Збережені статті" : "Зареєструватися";

  return (
    <section id="Join" className="section">
      <Container>
        <div className={styles.card}>
          <div className={styles.column}>
            <div className={styles.content}>
              <h2 className={styles.title}>
                Приєднуйся до спільноти свідомих мандрівників
              </h2>

              <p className={styles.text}>
                Стань частиною ком’юніті, де подорожі стають не лише
                пригодою, а й внеском у збереження природи. Тут ти знайдеш
                однодумців, поради для сталих мандрів та натхнення для нових
                маршрутів Україною.
              </p>
            </div>

            <div className={styles.actions}>
              {!isLoading && (
                <ButtonLink href={href} className={styles.button}>
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