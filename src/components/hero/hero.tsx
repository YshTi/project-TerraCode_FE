import Image from "next/image";

import heroImage from "../../../public/images/Hero-img.webp";

import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero_root} id="hero">
      <div className={styles.hero_container}>
        <div className={styles.hero_wrapper}>
          <div className={styles.hero_content}>
            <h1 className={styles.hero_title}>
              Відкрий Україну заново — еко-мандри для натхнення
            </h1>

            <p className={styles.hero_text}>
              Подорожуй екологічно, відкривай заповідні місця, гори та річки
              України. Ми зібрали маршрути, які допоможуть побачити красу
              природи без шкоди для неї.
            </p>

            <a className={styles.hero_button} href="#Join">
              Доєднатись до мандрів
            </a>
          </div>

          <div className={styles.hero_image_box}>
            <Image
              src={heroImage}
              alt="Природний краєвид України"
              className={styles.heroImage}
              priority
              fetchPriority="high"
              quality={75}
              placeholder="blur"
              sizes="
                (max-width: 767px) calc(100vw - 40px),
                (max-width: 1439px) 704px,
                644px
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}