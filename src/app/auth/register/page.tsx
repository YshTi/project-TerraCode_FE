<<<<<<< HEAD
import { AuthFooter } from "@/components/auth-footer/auth-footer";
import { AuthHeader } from "@/components/auth-header/auth-header";
import { AuthBar } from "@/components/auth-bar/auth-bar";
import { RegistrationForm } from "@/components/registration-form/registration-form";
=======
import { AuthHeader } from "@/components/auth-header/auth-header";
import { AuthBar } from "@/components/auth-bar/auth-bar";
import { RegistrationForm } from "@/components/registration-form/registration-form";
<<<<<<< HEAD
import { Copyright } from "@/components/copyright/copyright";
>>>>>>> main
=======
import { AuthFooter } from "@/components/auth-footer/auth-footer";
>>>>>>> c21de6e7a87851b8b646d9b4a5f223206f2eaf19

import styles from "./page.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <AuthHeader />
      </div>

      <div className={styles.authNav}>
        <AuthBar />
      </div>

      <main className={styles.registration}>
        <RegistrationForm />
      </main>

      <div className={styles.footer}>
<<<<<<< HEAD
<<<<<<< HEAD
        <AuthFooter />
=======
        <Copyright variant="short" />
>>>>>>> main
=======
        <AuthFooter />
>>>>>>> c21de6e7a87851b8b646d9b4a5f223206f2eaf19
      </div>
    </div>
  );
}