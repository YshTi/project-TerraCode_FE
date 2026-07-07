import Link from "next/link";
import { Container } from "@/components/container/container";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        <Link className={styles.logo} href="/">
          Природні Мандри
        </Link>

        <p className={styles.text}>
          © 2026 Природні Мандри. Всі права захищені.
        </p>
      </Container>
    </footer>
  );
}
