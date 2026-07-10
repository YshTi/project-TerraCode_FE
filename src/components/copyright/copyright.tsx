import styles from "./copyright.module.css";

type CopyrightProps = {
  variant?: "full" | "short";
};

export function Copyright({ variant = "full" }: CopyrightProps) {
  const currentYear = new Date().getFullYear();

  return (
    <p className={styles.copyright}>
      {variant === "full"
        ? `© ${currentYear} Природні Мандри. Усі права захищені.`
        : `© ${currentYear} Природні Мандри`}
    </p>
  );
}
