"use client";

import { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import { Button } from "@/components/buttons/button";
import { FieldError } from "@/components/field-error/field-error";
import { Loader } from "@/components/loader/loader";
import { DEFAULT_AVATAR_URL } from "@/constants/user";
import {
  updateProfileAvatar,
  updateProfileName,
  updateProfilePassword,
} from "@/lib/api/profileEditApi";
import { useAuth } from "@/providers/auth-provider";
import { notify } from "@/utils/notify";

import styles from "./page.module.css";

type ProfileEditValues = {
  name: string;
  avatar: File | null;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const MAX_AVATAR_SIZE = 1024 * 1024;

const profileEditSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Ім'я та прізвище має містити щонайменше 2 символи")
    .max(32, "Ім'я та прізвище має містити не більше 32 символів")
    .matches(
      /^\p{L}+(?:[ '’-]\p{L}+)*$/u,
      "Введіть коректне ім'я та прізвище",
    )
    .required("Введіть ім'я та прізвище"),

  avatar: Yup.mixed<File>()
    .nullable()
    .test(
      "file-size",
      "Фото має бути менше 1 MB",
      (value) => !value || value.size <= MAX_AVATAR_SIZE,
    )
    .test(
      "file-type",
      "Фото має бути у форматі JPG, PNG, GIF або WEBP",
      (value) =>
        !value ||
        [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ].includes(value.type),
    ),

  currentPassword: Yup.string(),
  newPassword: Yup.string(),
  confirmNewPassword: Yup.string(),
})
  .test("current-password-required", function (values) {
    if (!values) {
      return true;
    }

    const hasPasswordValues = Boolean(
      values.currentPassword ||
        values.newPassword ||
        values.confirmNewPassword,
    );

    if (hasPasswordValues && !values.currentPassword) {
      return this.createError({
        path: "currentPassword",
        message: "Введіть поточний пароль",
      });
    }

    return true;
  })
  .test("new-password-required", function (values) {
    if (!values) {
      return true;
    }

    const hasPasswordValues = Boolean(
      values.currentPassword ||
        values.newPassword ||
        values.confirmNewPassword,
    );

    if (hasPasswordValues && !values.newPassword) {
      return this.createError({
        path: "newPassword",
        message: "Введіть новий пароль",
      });
    }

    if (values.newPassword && values.newPassword.length < 8) {
      return this.createError({
        path: "newPassword",
        message: "Новий пароль має містити щонайменше 8 символів",
      });
    }

    if (values.newPassword && values.newPassword.length > 128) {
      return this.createError({
        path: "newPassword",
        message: "Новий пароль має містити не більше 128 символів",
      });
    }

    if (values.newPassword && /\s/.test(values.newPassword)) {
      return this.createError({
        path: "newPassword",
        message: "Пароль не повинен містити пробілів",
      });
    }

    if (values.newPassword && !/[\p{P}\p{S}]/u.test(values.newPassword)) {
      return this.createError({
        path: "newPassword",
        message: "Пароль має містити хоча б один спеціальний символ",
      });
    }

    return true;
  })
  .test("confirm-password-required", function (values) {
    if (!values) {
      return true;
    }

    const hasPasswordValues = Boolean(
      values.currentPassword ||
        values.newPassword ||
        values.confirmNewPassword,
    );

    if (hasPasswordValues && !values.confirmNewPassword) {
      return this.createError({
        path: "confirmNewPassword",
        message: "Повторіть новий пароль",
      });
    }

    if (
      values.newPassword &&
      values.confirmNewPassword &&
      values.newPassword !== values.confirmNewPassword
    ) {
      return this.createError({
        path: "confirmNewPassword",
        message: "Паролі не збігаються",
      });
    }

    return true;
  });

export default function ProfileEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user, isLoading, refreshUser } = useAuth();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  if (isLoading || !user) {
    return <Loader />;
  }

  const initialValues: ProfileEditValues = {
    name: user.name,
    avatar: null,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const currentAvatar = avatarPreview || user.avatarUrl || DEFAULT_AVATAR_URL;

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Редагувати профіль</h1>
        <p className={styles.description}>
          Оновіть фото, ім&apos;я або пароль.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={profileEditSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(undefined);

          const trimmedName = values.name.trim();
          const isNameChanged = trimmedName !== user.name;
          const isAvatarChanged = Boolean(values.avatar);
          const isPasswordChanged = Boolean(
            values.currentPassword ||
              values.newPassword ||
              values.confirmNewPassword,
          );

          if (!isNameChanged && !isAvatarChanged && !isPasswordChanged) {
            setStatus("Немає змін для збереження");
            setSubmitting(false);
            return;
          }

          try {
            if (isNameChanged) {
              await updateProfileName(trimmedName);
            }

            if (values.avatar) {
              await updateProfileAvatar(values.avatar);
            }

            if (isPasswordChanged) {
              await updateProfilePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmNewPassword: values.confirmNewPassword,
              });
            }

            await refreshUser();

            notify.success("Профіль успішно оновлено");

            router.push("/profile/saved");
            router.refresh();
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Не вдалося оновити профіль";

            setStatus(message);
            notify.error(message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          setFieldValue,
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
          dirty,
          status,
        }) => {
          const hasPasswordValues = Boolean(
            values.currentPassword ||
              values.newPassword ||
              values.confirmNewPassword,
          );

          const hasChanges = dirty || Boolean(values.avatar);

          return (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.avatarBlock}>
                <img
                  className={styles.avatar}
                  src={currentAvatar}
                  alt={user.name}
                />

                <div className={styles.avatarActions}>
                  <input
                    ref={fileInputRef}
                    className={styles.hiddenFileInput}
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] ?? null;

                      if (avatarPreview) {
                        URL.revokeObjectURL(avatarPreview);
                      }

                      setFieldValue("avatar", file);

                      if (file) {
                        setAvatarPreview(URL.createObjectURL(file));
                      } else {
                        setAvatarPreview(null);
                      }
                    }}
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    className={styles.uploadButton}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    Змінити фото
                  </Button>

                  <p className={styles.avatarHint}>
                    JPG, PNG, GIF або WEBP. До 1 MB.
                  </p>

                  {touched.avatar && (
                    <FieldError id="avatar-error" message={errors.avatar} />
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  Ім&apos;я та прізвище
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
                  aria-invalid={Boolean(touched.name && errors.name)}
                  aria-describedby={
                    touched.name && errors.name ? "name-error" : undefined
                  }
                />

                {touched.name && (
                  <FieldError id="name-error" message={errors.name} />
                )}
              </div>

              <div className={styles.passwordBlock}>
                <h2 className={styles.subtitle}>Змінити пароль</h2>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="currentPassword">
                    Поточний пароль
                  </label>

                  <input
                    className={`${styles.input} ${
                      touched.currentPassword && errors.currentPassword
                        ? styles.inputError
                        : ""
                    }`}
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Ваш поточний пароль"
                    value={values.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(
                      touched.currentPassword && errors.currentPassword,
                    )}
                  />

                  {touched.currentPassword && (
                    <FieldError
                      id="current-password-error"
                      message={errors.currentPassword}
                    />
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="newPassword">
                    Новий пароль
                  </label>

                  <input
                    className={`${styles.input} ${
                      touched.newPassword && errors.newPassword
                        ? styles.inputError
                        : ""
                    }`}
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Новий пароль"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(
                      touched.newPassword && errors.newPassword,
                    )}
                  />

                  {touched.newPassword && (
                    <FieldError
                      id="new-password-error"
                      message={errors.newPassword}
                    />
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="confirmNewPassword">
                    Повторіть новий пароль
                  </label>

                  <input
                    className={`${styles.input} ${
                      touched.confirmNewPassword && errors.confirmNewPassword
                        ? styles.inputError
                        : ""
                    }`}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    placeholder="Повторіть новий пароль"
                    value={values.confirmNewPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(
                      touched.confirmNewPassword && errors.confirmNewPassword,
                    )}
                  />

                  {touched.confirmNewPassword && (
                    <FieldError
                      id="confirm-password-error"
                      message={errors.confirmNewPassword}
                    />
                  )}
                </div>

                {!hasPasswordValues && (
                  <p className={styles.passwordHint}>
                    Залиште ці поля порожніми, якщо не хочете змінювати пароль.
                  </p>
                )}
              </div>

              {status && (
                <FieldError id="profile-edit-request-error" message={status} />
              )}

              <div className={styles.actions}>
                <Button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting || !hasChanges || !isValid}
                >
                  Зберегти
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className={styles.cancelButton}
                  onClick={() => router.push("/profile/saved")}
                  disabled={isSubmitting}
                >
                  Відмінити
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </section>
  );
}
