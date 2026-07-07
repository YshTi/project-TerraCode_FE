"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/button/button";
import styles from "./main-auth-nav.module.css";

const authLinks = [
  {
    href: "/auth/login",
    label: "Вхід",
    variant: "secondary" as const,
    className: styles.loginButton,
  },
  {
    href: "/auth/register",
    label: "Реєстрація",
    variant: "primary" as const,
    className: styles.registerButton,
  },
];

export function MainAuthNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.authNav} aria-label="Навігація авторизації">
      {authLinks.map(({ href, label, variant, className}) => {
        const isActive = pathname === href;

        return (
          <ButtonLink
            key={href}
            href={href}
            variant={variant}
            className={`${className} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </ButtonLink>
        );
      })}
    </nav>
  );
}