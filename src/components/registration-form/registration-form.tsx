"use client";

import { Formik } from "formik";
import * as Yup from "yup";
import { FieldError } from "@/components/field-error/field-error";
import { Button } from "@/components/buttons/button";
import styles from "./registration-form.module.css";
import { useRouter } from "next/navigation";
import { notify } from "@/utils/notify";

const registrationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Ім'я та прізвище має містити щонайменше 2 символи")
    .max(32, "Ім'я та прізвище має містити не більше 32 символів")
    .matches(
      /^\p{L}+(?:[ '-]\p{L}+)*$/u,
      "Введіть коректне ім'я та прізвище",
    )
    .required("Введіть ім'я та прізвище"),

  email: Yup.string()
    .trim()
    .email("Введіть коректну електронну адресу")
    .max(64, "Пошта має містити не більше 64 символів")
    .required("Введіть електронну адресу"),

  password: Yup.string()
    .min(8, "Пароль має містити щонайменше 8 символів")
    .max(128, "Пароль має містити не більше 128 символів")
    .matches(/^\S+$/, "Пароль не повинен містити пробілів")
    .matches(
      /[\p{P}\p{S}]/u,
      "Пароль має містити хоча б один спеціальний символ",
    )
    .required("Введіть пароль"),
});

export function RegistrationForm() {
  const router = useRouter();
  
  return (
    <section className={styles.registration}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Реєстрація</h1>

        <p className={styles.description}>
          Раді вас бачити у спільноті мандрівників!
        </p>
      </div>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={registrationSchema}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
            try {
                const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                if (response.status === 409) {
                  notify.error("Користувач із такою поштою вже існує");
                  return;
                }

                if (data.errors) {
                    setErrors({
                    name: data.errors.name?.[0],
                    email: data.errors.email?.[0],
                    password: data.errors.password?.[0],
                    });
                }

                return;
                }

                router.push("/");
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
        }) => (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">
                Ім&apos;я та Прізвище*
              </label>

              <input
                className={`${styles.input} ${
                  touched.name && errors.name ? styles.inputError : ""
                }`}
                id="name"
                name="name"
                type="text"
                placeholder="Ваше ім'я та прізвище"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.name && Boolean(errors.name)}
                aria-describedby={
                  touched.name && errors.name ? "name-error" : undefined
                }
              />

              {touched.name && (
                <FieldError id="name-error" message={errors.name} />
                )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Пошта*
              </label>

              <input
                className={`${styles.input} ${
                  touched.email && errors.email ? styles.inputError : ""
                }`}
                id="email"
                name="email"
                type="email"
                placeholder="Ваша пошта"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.email && Boolean(errors.email)}
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
                  touched.password && errors.password ? styles.inputError : ""
                }`}
                id="password"
                name="password"
                type="password"
                placeholder="Ваш пароль"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.password && Boolean(errors.password)}
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

            <Button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              Зареєструватись
            </Button>
          </form>
        )}
      </Formik>
    </section>
  );
}