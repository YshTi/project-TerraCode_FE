import { AuthHeader } from "@/components/auth-header/auth-header";
import { AuthBar } from "@/components/auth-bar/auth-bar";
import { RegistrationForm } from "@/components/registration-form/registration-form";
import { AuthFooter } from "@/components/auth-footer/auth-footer";
import { ThemeSwitch } from "@/components/theme-switch/theme-switch";

import styles from "./page.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <AuthHeader />
        <ThemeSwitch />
      </div>

      <div className={styles.authNav}>
        <AuthBar />
      </div>

      <main className={styles.registration}>
        <RegistrationForm />
      </main>

      <div className={styles.footer}>
        <AuthFooter />
      </div>
    </div>
  );
}
