<<<<<<< HEAD
export default function LoginPage() {
  return <div>Login page</div>;
=======
import { LoginForm } from '@/components/login-form/login-form';
import { AuthHeader } from "@/components/auth-header/auth-header";
import { AuthBar } from "@/components/auth-bar/auth-bar";
import { Copyright } from "@/components/copyright/copyright";

import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.header}>
        <AuthHeader />
      </div>

      <main className={styles.login}>
        <AuthBar />
        <LoginForm />
      </main>

      <div className={styles.footer}>
        <Copyright variant="short" />
      </div>
    </div>
  );
>>>>>>> main
}