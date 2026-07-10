import clsx from "clsx";

import styles from "./toaster.module.css";

type NotificationProps = {
  type: "success" | "error" | "info";
  message: string;
};

export function Notification({
  type,
  message,
}: NotificationProps) {
  return (
    <div
      className={clsx(styles.toast, {
        [styles.success]: type === "success",
        [styles.error]: type === "error",
        [styles.info]: type === "info",
      })}
    >
      <div className={styles.icon}>
        {type === "success" && "✓"}
        {type === "error" && "✕"}
        {type === "info" && "!"}
      </div>

      <span className={styles.message}>{message}</span>
    </div>
  );
}