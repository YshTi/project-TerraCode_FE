"use client";

import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import { Button } from "@/components/buttons/button";
import { FieldError } from "@/components/field-error/field-error";
import { useAuth } from "@/providers/auth-provider";
import { notify } from "@/utils/notify";

import styles from "./login-form.module.css";

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Введіть коректну електронну адресу")
    .max(64, "Пошта має містити не більше 64 символів")
    .required("Введіть електронну адресу"),

  password: Yup.string().required("Введіть пароль"),
});

export function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [hasAuthError, setHasAuthError] = useState(false);

  return (
    <section className={styles.login}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Вхід</h1>

        <p className={styles.description}>
          Увійдіть, щоб продовжити подорож!
        </p>
      </div>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setErrors, setSubmitting, setStatus }) => {
          setStatus(undefined);
          setHasAuthError(false);

          try {
            const response = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
              if (response.status === 401) {
                setHasAuthError(true);
                setStatus("Невірна пошта або пароль");

                notify.error("Невірна пошта або пароль");
                return;
              }

              if (data.errors) {
                setErrors({
                  email: data.errors.email?.[0],
                  password: data.errors.password?.[0],
                });

                return;
              }

              setStatus(data.message || "Не вдалося увійти");

              notify.error(data.message || "Не вдалося увійти");
              return;
            }

            await refreshUser();

            notify.success("Вітаємо! Ви успішно увійшли.");

            router.push("/");
            router.refresh();
          } catch {
            setStatus("Помилка з'єднання з сервером");
            
            notify.error("Помилка з'єднання з сервером");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
          dirty,
          status,
          setStatus,
        }) => (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Пошта*
              </label>

              <input
                className={`${styles.input} ${
                  (touched.email && errors.email) || hasAuthError
                    ? styles.inputError
                    : ""
                }`}
                id="email"
                name="email"
                type="email"
                placeholder="hello@podorozhnyky.ua"
                value={values.email}
                onChange={(e) => {
                  if (hasAuthError) {
                    setHasAuthError(false);
                    setStatus(undefined);
                  }

                  handleChange(e);
                }}
                onBlur={handleBlur}
                aria-invalid={
                  Boolean(touched.email && errors.email) || hasAuthError
                }
                aria-describedby={
                  touched.email && errors.email ? "email-error" : undefined
                }
              />

              {touched.email && (
                <FieldError id="email-error" message={errors.email} />
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Пароль*
              </label>

              <input
                className={`${styles.input} ${
                  (touched.password && errors.password) || hasAuthError
                    ? styles.inputError
                    : ""
                }`}
                id="password"
                name="password"
                type="password"
                placeholder="Ваш пароль"
                value={values.password}
                onChange={(e) => {
                  if (hasAuthError) {
                    setHasAuthError(false);
                    setStatus(undefined);
                  }

                  handleChange(e);
                }}
                onBlur={handleBlur}
                aria-invalid={
                  Boolean(touched.password && errors.password) ||
                  hasAuthError
                }
                aria-describedby={
                  touched.password && errors.password
                    ? "password-error"
                    : undefined
                }
              />

              {touched.password && (
                <FieldError id="password-error" message={errors.password} />
              )}
            </div>

            {status && (
              <FieldError
                id="login-request-error"
                message={status}
              />
            )}

            <Button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !dirty || !isValid || hasAuthError}
            >
              Увійти
            </Button>
          </form>
        )}
      </Formik>
    </section>
  );
}