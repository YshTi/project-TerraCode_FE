import Link from "next/link";
import styles from "./auth-bar.module.css";

export function AuthBar() {
  return (
    <nav className={styles.authBar}>
      <Link className={`${styles.link} ${styles.active}`} href="/auth/register">
        Реєстрація
      </Link>

      <Link className={styles.link} href="/auth/login">
        Вхід
      </Link>
    </nav>
  );
}
