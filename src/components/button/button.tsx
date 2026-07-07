import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from "react";

import styles from "./button.module.css";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}