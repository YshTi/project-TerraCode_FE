<<<<<<< HEAD
<<<<<<< HEAD
export default function LoginPage() {
  return <div>Login page</div>;
=======
import { LoginForm } from '@/components/login-form/login-form';
import { AuthHeader } from "@/components/auth-header/auth-header";
=======
>>>>>>> c21de6e7a87851b8b646d9b4a5f223206f2eaf19
import { AuthBar } from "@/components/auth-bar/auth-bar";
import { AuthHeader } from "@/components/auth-header/auth-header";
import { LoginForm } from "@/components/login-form/login-form";
import { AuthFooter } from "@/components/auth-footer/auth-footer";

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
        <AuthFooter />
      </div>
    </div>
  );
<<<<<<< HEAD
>>>>>>> main
}
=======
}
>>>>>>> c21de6e7a87851b8b646d9b4a5f223206f2eaf19
