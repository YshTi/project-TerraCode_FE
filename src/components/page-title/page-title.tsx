import styles from "./page-title.module.css";

type PageTitleProps = {
  title: string;
};

export function PageTitle({ title }: PageTitleProps) {
  return <h1 className={styles.title}>{title}</h1>;
}
