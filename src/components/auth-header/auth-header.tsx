"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";

import styles from "./auth-header.module.css";

type AuthHeaderProps = {
  onNavigate?: () => void;
};

export function AuthHeader({
  onNavigate,
}: AuthHeaderProps) {
  const pathname = usePathname();

  const handleLogoClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    onNavigate?.();

    if (pathname === "/") {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className={styles.authHeader}>
      <Link
        className={styles.logoHeader}
        href="/"
        scroll
        onClick={handleLogoClick}
        aria-label="Перейти на початок головної сторінки"
      >
        <SpriteIcon
          id="icon-eco"
          width={24}
          height={24}
          className={styles.logoIcon}
        />

        <span className={styles.logoText}>
          Природні Мандри
        </span>
      </Link>
    </header>
  );
}