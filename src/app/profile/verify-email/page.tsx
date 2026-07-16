"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ButtonLink } from "@/components/buttons/button";
import { Loader } from "@/components/loader/loader";

import styles from "./page.module.css";

type VerificationState =
  | "loading"
  | "success"
  | "error";

type VerificationResponse = {
  message?: string;
};

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] =
    useState<VerificationState>(
      token ? "loading" : "error",
    );

  const [message, setMessage] = useState(
    token
      ? "Підтверджуємо вашу нову електронну адресу..."
      : "Посилання не містить токена підтвердження.",
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const verificationToken = token;
    let isCancelled = false;

    async function verifyEmail() {
      try {
        const response = await fetch(
          `/api/profile/verify-email?token=${encodeURIComponent(
            verificationToken,
          )}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data =
          (await response.json().catch(() => ({
            message:
              "Не вдалося прочитати відповідь сервера",
          }))) as VerificationResponse;

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Не вдалося підтвердити електронну адресу",
          );
        }

        if (isCancelled) {
          return;
        }

        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        }).catch(() => {
          // Verification still succeeded even if logout cleanup failed.
        });

        if (isCancelled) {
          return;
        }

        if ("BroadcastChannel" in window) {
          const authChannel =
            new BroadcastChannel("auth");

          authChannel.postMessage({
            type: "logout",
          });

          authChannel.close();
        }

        setState("success");
        setMessage(
          "Електронну адресу успішно підтверджено та оновлено. Попередню сесію завершено. Тепер увійдіть із новою адресою.",
        );
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setState("error");

        setMessage(
          error instanceof Error
            ? error.message
            : "Не вдалося підтвердити електронну адресу",
        );
      }
    }

    void verifyEmail();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  if (state === "loading") {
    return (
      <main className={styles.main}>
        <section className={styles.card}>
          <Loader />

          <h1 className={styles.title}>
            Підтвердження пошти
          </h1>

          <p className={styles.text}>
            {message}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <div
          className={
            state === "success"
              ? styles.successIcon
              : styles.errorIcon
          }
          aria-hidden="true"
        >
          {state === "success" ? "✓" : "!"}
        </div>

        <h1 className={styles.title}>
          {state === "success"
            ? "Пошту підтверджено"
            : "Не вдалося підтвердити пошту"}
        </h1>

        <p className={styles.text}>
          {message}
        </p>

        <div className={styles.actions}>
          {state === "success" ? (
            <ButtonLink href="/auth/login">
              Увійти з новою поштою
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href="/profile/edit">
                Повернутися до профілю
              </ButtonLink>

              <ButtonLink
                href="/"
                variant="secondary"
              >
                На головну
              </ButtonLink>
            </>
          )}
        </div>
      </section>
    </main>
  );
}