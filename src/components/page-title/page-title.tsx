import type { ReactNode } from "react";

import styles from "./page-title.module.css";

type PageTitleProps = {
  children: ReactNode;
};

export function PageTitle({ children }: PageTitleProps) {
  return <h1 className={styles.title}>{children}</h1>;
}
