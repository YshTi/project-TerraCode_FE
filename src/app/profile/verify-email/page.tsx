"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { ButtonLink } from "@/components/buttons/button";
import { Loader } from "@/components/loader/loader";
import { useAuth } from "@/providers/auth-provider";

import styles from "./page.module.css";

type VerificationState =
  | "loading"
  | "success"
  | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

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
    let redirectTimeout: number | null = null;

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

        const data = await response
          .json()
          .catch(() => ({
            message:
              "Не вдалося прочитати відповідь сервера",
          }));

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Не вдалося підтвердити електронну адресу",
          );
        }

        if (isCancelled) {
          return;
        }

        await refreshUser();

        if (isCancelled) {
          return;
        }

        setState("success");
        setMessage(
          "Електронну адресу успішно підтверджено та оновлено.",
        );

        redirectTimeout = window.setTimeout(
          () => {
            if (!isCancelled) {
              router.replace("/profile/edit");
              router.refresh();
            }
          },
          2500,
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

      if (redirectTimeout !== null) {
        window.clearTimeout(
          redirectTimeout,
        );
      }
    };
  }, [refreshUser, router, token]);

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
          <ButtonLink href="/profile/edit">
            Повернутися до профілю
          </ButtonLink>

          {state === "error" && (
            <ButtonLink
              href="/"
              variant="secondary"
            >
              На головну
            </ButtonLink>
          )}
        </div>
      </section>
    </main>
  );
}