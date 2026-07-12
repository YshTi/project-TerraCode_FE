import styles from "./copyright.module.css";

type CopyrightProps = {
  variant?: "full" | "short";
  className?: string;
};

export function Copyright({
  variant = "full",
  className = "",
}: CopyrightProps) {
  const currentYear = new Date().getFullYear();

  return (
    <p className={`${styles.copyright} ${className}`}>
      {variant === "full"
        ? `© ${currentYear} Природні Мандри. Усі права захищені.`
        : `© ${currentYear} Природні Мандри`}
    </p>
  );
}
