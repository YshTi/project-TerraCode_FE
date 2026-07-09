import styles from "./copyright.module.css";

export function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <p className={styles.copyright}>
      © {currentYear} Природні Мандри. Усі права захищені.
    </p>
  );
}
