import { AuthFooter } from "@/components/auth-footer/auth-footer";
import { AuthHeader } from "@/components/auth-header/auth-header";
import { LoginForm } from "@/components/login-form/login-form";
import { MainAuthNav } from "@/components/main-auth-nav/main-auth-nav";

import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <>
      <AuthHeader />

      <main className={styles.main}>
        <div className={styles.content}>
          <MainAuthNav />
          <LoginForm />
        </div>
      </main>

      <AuthFooter />
    </>
  );
}
