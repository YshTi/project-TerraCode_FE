import Link from "next/link";
import { Container } from "@/components/container/container";
import styles from "./footer.module.css";
import { AuthFooter } from "@/components/auth-footer/auth-footer";

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
      <AuthFooter />
    </footer>
  );
}
