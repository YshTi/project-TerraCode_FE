"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/buttons/button";

import styles from "./login-form.module.css";

type LoginFormValues = {
  email: string;
  password: string;
};

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Введіть коректну пошту")
    .required("Пошта обовʼязкова"),
  password: Yup.string()
    .min(8, "Пароль має містити мінімум 8 символів")
    .required("Пароль обовʼязковий"),
});

export function LoginForm() {
  const handleSubmit = (values: LoginFormValues) => {
    console.log("Login values:", values);
  };

  return (
    <section className={styles.loginFormSection}>
      <h1 className={styles.title}>Вхід</h1>
      <p className={styles.description}>
        Вітаємо знову у спільноту мандрівників!
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <label className={styles.label}>
              Пошта*
              <Field
                className={styles.input}
                type="email"
                name="email"
                placeholder="hello@podorozhnyky.ua"
              />
              <ErrorMessage
                name="email"
                component="p"
                className={styles.error}
              />
            </label>

            <label className={styles.label}>
              Пароль*
              <Field
                className={styles.input}
                type="password"
                name="password"
                placeholder="••••••••"
              />
              <ErrorMessage
                name="password"
                component="p"
                className={styles.error}
              />
            </label>

            <Button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              Увійти
            </Button>
          </Form>
        )}
      </Formik>
    </section>
  );
}
