import Link from "next/link";
import { Container } from "@/components/container/container";
import styles from "./auth-header.module.css";

export function AuthHeader() {
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <Link className={styles.logo} href="/">
          Природні Мандри
        </Link>
      </Container>
    </header>
  );
}
