"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./auth-bar.module.css";

const authLinks = [
  {
    href: "/auth/register",
    label: "Реєстрація",
  },
  {
    href: "/auth/login",
    label: "Вхід",
  },
];

export function AuthBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.authBar} aria-label="Навігація авторизації">
      {authLinks.map(({ href, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`${styles.link} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}