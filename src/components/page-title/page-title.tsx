import type { ReactNode } from "react";

import styles from "./page-title.module.css";

type PageTitleProps = {
  children: ReactNode;
  className?: string;
};

export function PageTitle({
  children,
  className,
}: PageTitleProps) {
  return (
    <h1 className={`${styles.title} ${className ?? ""}`}>
      {children}
    </h1>
  );
}
