import Link from "next/link";
import styles from "./auth-bar.module.css";

export function AuthBar() {
  return (
    <nav className={styles.authBar}>
      <Link className={`${styles.link} ${styles.login}`} href="/auth/login">
        Вхід
      </Link>

      <Link
        className={`${styles.link} ${styles.register}`}
        href="/auth/register"
      >
        Реєстрація
      </Link>
    </nav>
  );
}
