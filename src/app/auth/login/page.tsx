import { AuthBar } from "@/components/auth-bar/auth-bar";
import { AuthHeader } from "@/components/auth-header/auth-header";
import { LoginForm } from "@/components/login-form/login-form";
import { AuthFooter } from "@/components/auth-footer/auth-footer";
import { ThemeSwitch } from "@/components/theme-switch/theme-switch";

import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.header}>
        <AuthHeader />
        <ThemeSwitch />
      </div>

      <main className={styles.login}>
        <AuthBar />
        <LoginForm />
      </main>

      <div className={styles.footer}>
        <AuthFooter />
      </div>
    </div>
  );
}
