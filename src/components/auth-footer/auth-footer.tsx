import { Copyright } from "@/components/copyright/copyright";

import styles from "./auth-footer.module.css";

export function AuthFooter() {
  return (
    <footer className={styles.footer}>
      <Copyright variant="short" />
    </footer>
  );
}