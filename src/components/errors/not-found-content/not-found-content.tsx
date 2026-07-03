import Link from "next/link";
import styles from "./not-found-content.module.css";

export function NotFoundContent() {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Сторінку не знайдено</h1>
      <p className={styles.text}>
        Сторінка, яку ви шукаєте, не існує або була переміщена.
      </p>
      <Link className={styles.link} href="/">
        Повернутися на головну
      </Link>
    </section>
  );
}
