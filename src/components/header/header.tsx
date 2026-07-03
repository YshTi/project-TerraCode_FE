import Link from "next/link";
import { Container } from "@/components/container/container";
import styles from "./header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <Link className={styles.logo} href="/">
          Природні Мандри
        </Link>

        <nav className={styles.nav}>
          <Link href="/stories">Історії</Link>
          <Link href="/travellers">Мандрівники</Link>
          <Link href="/auth/login">Увійти</Link>
        </nav>
      </Container>
    </header>
  );
}
