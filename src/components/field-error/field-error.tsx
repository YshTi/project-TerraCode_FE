import styles from "./field-error.module.css";

type FieldErrorProps = {
  id: string;
  message?: string;
};

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className={styles.error} aria-live="polite">
      {message}
    </p>
  );
}