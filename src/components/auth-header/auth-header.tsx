import Link from "next/link";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import styles from "./auth-header.module.css";

export function AuthHeader() {
  return (
    <header className={styles.authHeader}>
      <Link className={styles.logoHeader} href="/">
        <SpriteIcon
          id="icon-eco"
          width={24}
          height={24}
          className={styles.logoIcon}
        />
        <span className={styles.logoText}>Природні Мандри</span>
      </Link>
    </header>
  );
}
