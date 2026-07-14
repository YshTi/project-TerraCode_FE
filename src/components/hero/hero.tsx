import Image from "next/image";
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
              src="/images/Hero-img.webp"
              alt="Головне зображення"
              className={styles["hero-image"]}
              width={644}
              height={580}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
