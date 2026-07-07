import Link from "next/link";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import styles from "./auth-header.module.css";

export function AuthHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/">
        <SpriteIcon id="icon-eco" width={24} height={24} />
        <span>Природні Мандри</span>
      </Link>
    </header>
  );
}
