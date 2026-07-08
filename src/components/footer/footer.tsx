import Link from "next/link";

import { Container } from "@/components/container/container";
import { Copyright } from "@/components/copyright/copyright";

import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        <Link className={styles.logo} href="/">
          Природні Мандри
        </Link>

        <Copyright />
      </Container>
    </footer>
  );
}
