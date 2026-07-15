import Image from "next/image";

import { Container } from "@/components/container/container";

import aboutImage from "../../../public/images/about-img.webp";

import styles from "./about.module.css";

export function About() {
  return (
    <section className={styles.about}>
      <Container>
        <div className={styles.aboutWrapper}>
          <div className={styles.aboutContent}>
            <h2 className={styles.aboutTitle}>
              Мандруй екологічно та відкривай нові горизонти
            </h2>

            <p className={styles.aboutDescription}>
              Наш проєкт створений для тих, хто хоче досліджувати Україну
              відповідально. Ми допоможемо знайти унікальні маршрути, які
              поєднують красу природи, локальну культуру та принципи сталого
              туризму.
            </p>

            <ul className={styles.aboutList}>
              <li className={styles.aboutItem}>
                <h3 className={styles.aboutItemTitle}>
                  Еко-маршрути по Україні
                </h3>

                <p className={styles.aboutText}>
                  Від Карпат до Чорного моря — добірка локацій, де можна
                  подорожувати без шкоди для довкілля.
                </p>
              </li>

              <li className={styles.aboutItem}>
                <h3 className={styles.aboutItemTitle}>
                  Практичні екологічні поради
                </h3>

                <p className={styles.aboutText}>
                  Дізнайся, як зменшити свій екологічний слід під час мандрів
                  та зробити подорож комфортною й свідомою.
                </p>
              </li>
            </ul>
          </div>

          <div className={styles.aboutImg}>
            <Image
              src={aboutImage}
              alt="Природний пейзаж України"
              className={styles.image}
              sizes="
                (max-width: 767px) calc(100vw - 40px),
                (max-width: 1439px) calc(100vw - 64px),
                644px
              "
              quality={70}
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}