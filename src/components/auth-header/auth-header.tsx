import Link from "next/link";

import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";

import styles from "./auth-header.module.css";

type AuthHeaderProps = {
  onNavigate?: () => void;
};

export function AuthHeader({ onNavigate }: AuthHeaderProps) {
  return (
    <header className={styles.authHeader}>
      <Link
        className={styles.logoHeader}
        href="/"
        onClick={onNavigate}
        aria-label="Перейти на головну сторінку"
      >
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