import styles from "./loader.module.css";

export function Loader() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Завантаження">
      <div className={styles.loader} />
    </div>
  );
}
