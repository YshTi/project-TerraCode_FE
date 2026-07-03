import styles from "./error-content.module.css";

type ErrorContentProps = {
  error: Error;
  reset: () => void;
};

export function ErrorContent({ error, reset }: ErrorContentProps) {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Щось пішло не так</h1>
      <p className={styles.text}>{error.message}</p>

      <button className={styles.button} type="button" onClick={reset}>
        Спробувати ще раз
      </button>
    </section>
  );
}