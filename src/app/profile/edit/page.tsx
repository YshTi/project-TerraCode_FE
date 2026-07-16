"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/buttons/button";
import { FieldError } from "@/components/field-error/field-error";
import { Loader } from "@/components/loader/loader";
import { DEFAULT_AVATAR_URL } from "@/constants/user";
import {
  updateProfileAvatar,
  updateProfileEmail,
  updateProfileName,
  updateProfilePassword,
} from "@/lib/api/profileEditApi";
import { useAuth } from "@/providers/auth-provider";
import { notify } from "@/utils/notify";
import Image from "next/image";

import styles from "./page.module.css";

type ProfileEditValues = {
  name: string;
  email: string;
  avatar: File | null;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const MAX_AVATAR_SIZE = 1024 * 1024;

const ACCEPTED_AVATAR_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

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
  
  email: Yup.string()
    .trim()
    .email("Введіть коректну електронну адресу")
    .required("Введіть електронну адресу"),

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
      (value) => !value || ACCEPTED_AVATAR_TYPES.includes(value.type),
    ),

  currentPassword: Yup.string().test(
    "current-password-required",
    "Введіть поточний пароль",
    function (value) {
      const {
        newPassword,
        confirmNewPassword,
      } = this.parent as ProfileEditValues;

      const isPasswordChangeStarted = Boolean(
        value || newPassword || confirmNewPassword,
      );

      return !isPasswordChangeStarted || Boolean(value);
    },
  ),

  newPassword: Yup.string()
    .test(
      "new-password-required",
      "Введіть новий пароль",
      function (value) {
        const {
          currentPassword,
          confirmNewPassword,
        } = this.parent as ProfileEditValues;

        const isPasswordChangeStarted = Boolean(
          currentPassword || value || confirmNewPassword,
        );

        return !isPasswordChangeStarted || Boolean(value);
      },
    )
    .test(
      "new-password-min",
      "Новий пароль має містити щонайменше 8 символів",
      (value) => !value || value.length >= 8,
    )
    .test(
      "new-password-max",
      "Новий пароль має містити не більше 128 символів",
      (value) => !value || value.length <= 128,
    )
    .test(
      "new-password-spaces",
      "Пароль не повинен містити пробілів",
      (value) => !value || !/\s/.test(value),
    )
    .test(
      "new-password-special",
      "Пароль має містити хоча б один спеціальний символ",
      (value) => !value || /[\p{P}\p{S}]/u.test(value),
    ),

  confirmNewPassword: Yup.string()
    .test(
      "confirm-password-required",
      "Повторіть новий пароль",
      function (value) {
        const {
          currentPassword,
          newPassword,
        } = this.parent as ProfileEditValues;

        const isPasswordChangeStarted = Boolean(
          currentPassword || newPassword || value,
        );

        return !isPasswordChangeStarted || Boolean(value);
      },
    )
    .test(
      "passwords-match",
      "Паролі не збігаються",
      function (value) {
        const { newPassword } = this.parent as ProfileEditValues;

        if (!newPassword || !value) {
          return true;
        }

        return value === newPassword;
      },
    ),
});

function getProfileErrorMessage(error: unknown) {
  const fallbackMessage = "Не вдалося оновити профіль";

  if (!(error instanceof Error)) {
    return fallbackMessage;
  }

  const messages: Record<string, string> = {
    "Current password is incorrect":
      "Введено неправильний поточний пароль",
    "Invalid current password":
      "Введено неправильний поточний пароль",
    "User not found":
      "Користувача не знайдено",
    "Not authorized":
      "Ви не авторизовані",
    "Email already in use":
      "Ця електронна адреса вже використовується",
    "Email already exists":
      "Ця електронна адреса вже використовується",
    "Email is already registered":
      "Ця електронна адреса вже зареєстрована",
  };

  return messages[error.message] ?? error.message ?? fallbackMessage;
}

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
    email: user.email,
    avatar: null,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const currentAvatar =
    avatarPreview || user.avatarUrl || DEFAULT_AVATAR_URL;

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h1 className={styles.title}>
          Редагувати профіль
        </h1>

        <p className={styles.description}>
          Оновіть фото, ім&apos;я, електронну пошту або пароль.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={profileEditSchema}
        enableReinitialize
        validateOnChange
        validateOnBlur
        onSubmit={async (
          values,
          {
            setSubmitting,
            setStatus,
            resetForm,
          },
        ) => {
          setStatus(undefined);

          const trimmedName = values.name.trim();
          const trimmedEmail = values.email.trim().toLowerCase();
          const currentEmail = user.email.trim().toLowerCase();

          const isNameChanged = trimmedName !== user.name;
          const isEmailChanged = trimmedEmail !== currentEmail;
          const isAvatarChanged = Boolean(values.avatar);
          const isPasswordChanged = Boolean(
            values.currentPassword ||
              values.newPassword ||
              values.confirmNewPassword,
          );

          if (
            !isNameChanged &&
            !isEmailChanged &&
            !isAvatarChanged &&
            !isPasswordChanged
          ) {
            const message = "Немає змін для збереження";

            setStatus(message);
            notify.error(message);
            setSubmitting(false);
            return;
          }

          try {
            if (isNameChanged) {
              await updateProfileName(trimmedName);
            }

            if (isEmailChanged) {
              await updateProfileEmail(trimmedEmail);
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

            if (isEmailChanged) {
              notify.success(
                `Лист для підтвердження надіслано на ${trimmedEmail}`,
              );
            } else {
              notify.success("Профіль успішно оновлено");
            }

            resetForm({
              values: {
                name: trimmedName,
                email: user.email,
                avatar: null,
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              },
            });

            if (avatarPreview) {
              URL.revokeObjectURL(avatarPreview);
              setAvatarPreview(null);
            }

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            if (!isEmailChanged) {
              router.push("/profile/saved");
            }

            router.refresh();
          } catch (error) {
            const message = getProfileErrorMessage(error);

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
          setFieldTouched,
          setTouched,
          validateForm,
          setStatus,
          values,
          errors,
          touched,
          isSubmitting,
          dirty,
          status,
        }) => {
          const hasPasswordValues = Boolean(
            values.currentPassword ||
              values.newPassword ||
              values.confirmNewPassword,
          );

          const hasChanges = dirty || Boolean(values.avatar);

          const clearRequestError = () => {
            if (status) {
              setStatus(undefined);
            }
          };

          const handleTextFieldChange = (
            event: ChangeEvent<HTMLInputElement>,
          ) => {
            clearRequestError();
            handleChange(event);
          };

          const handleValidatedSubmit = async (
            event: FormEvent<HTMLFormElement>,
          ) => {
            event.preventDefault();

            if (!hasChanges) {
              notify.error("Немає змін для збереження");
              return;
            }

            const validationErrors = await validateForm();

            if (Object.keys(validationErrors).length > 0) {
              await setTouched(
                {
                  name: true,
                  email: true,
                  avatar: true,
                  currentPassword: true,
                  newPassword: true,
                  confirmNewPassword: true,
                },
                false,
              );

              const firstError =
                validationErrors.name ||
                validationErrors.email ||
                validationErrors.avatar ||
                validationErrors.currentPassword ||
                validationErrors.newPassword ||
                validationErrors.confirmNewPassword ||
                "Перевірте правильність заповнення форми";

              notify.error(String(firstError));
              return;
            }

            handleSubmit();
          };

          const nameHasError = Boolean(
            touched.name && errors.name,
          );

          const nameHasSuccess = Boolean(
            touched.name &&
              values.name.trim() &&
              !errors.name,
          );

          const emailHasError = Boolean(
            touched.email && errors.email,
          );

          const emailHasSuccess = Boolean(
            touched.email &&
              values.email.trim() &&
              !errors.email,
          );

          const currentPasswordHasError = Boolean(
            touched.currentPassword &&
              errors.currentPassword,
          );

          const currentPasswordHasSuccess = Boolean(
            touched.currentPassword &&
              values.currentPassword &&
              !errors.currentPassword,
          );

          const newPasswordHasError = Boolean(
            touched.newPassword &&
              errors.newPassword,
          );

          const newPasswordHasSuccess = Boolean(
            touched.newPassword &&
              values.newPassword &&
              !errors.newPassword,
          );

          const confirmPasswordHasError = Boolean(
            touched.confirmNewPassword &&
              errors.confirmNewPassword,
          );

          const confirmPasswordHasSuccess = Boolean(
            touched.confirmNewPassword &&
              values.confirmNewPassword &&
              !errors.confirmNewPassword,
          );

          return (
            <form
              className={styles.form}
              onSubmit={handleValidatedSubmit}
              noValidate
            >
              {isSubmitting && <Loader />}

              <div className={styles.avatarBlock}>
                <Image
                  className={styles.avatar}
                  src={currentAvatar}
                  alt={user.name}
                  width={110}
                  height={110}
                  unoptimized
                />

                <div className={styles.avatarActions}>
                  <input
                    ref={fileInputRef}
                    className={styles.hiddenFileInput}
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={async (event) => {
                      clearRequestError();

                      const file =
                        event.currentTarget.files?.[0] ?? null;

                      if (avatarPreview) {
                        URL.revokeObjectURL(avatarPreview);
                      }

                      await setFieldValue(
                        "avatar",
                        file,
                        true,
                      );

                      await setFieldTouched(
                        "avatar",
                        true,
                        true,
                      );

                      if (!file) {
                        setAvatarPreview(null);
                        return;
                      }

                      if (file.size > MAX_AVATAR_SIZE) {
                        setAvatarPreview(null);
                        notify.error("Фото має бути менше 1 MB");
                        return;
                      }

                      if (
                        !ACCEPTED_AVATAR_TYPES.includes(file.type)
                      ) {
                        setAvatarPreview(null);
                        notify.error(
                          "Фото має бути у форматі JPG, PNG, GIF або WEBP",
                        );
                        return;
                      }

                      setAvatarPreview(
                        URL.createObjectURL(file),
                      );
                    }}
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    className={styles.uploadButton}
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={isSubmitting}
                  >
                    Змінити фото
                  </Button>

                  <p className={styles.avatarHint}>
                    JPG, PNG, GIF або WEBP. До 1 MB.
                  </p>

                  <FieldError
                    id="avatar-error"
                    message={
                      touched.avatar
                        ? errors.avatar
                        : undefined
                    }
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label
                  className={styles.label}
                  htmlFor="name"
                >
                  Ім&apos;я та прізвище
                </label>

                <input
                  className={`${styles.input} ${
                    nameHasError
                      ? styles.inputError
                      : nameHasSuccess
                        ? styles.inputSuccess
                        : ""
                  }`}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ваше ім'я та прізвище"
                  value={values.name}
                  onChange={handleTextFieldChange}
                  onBlur={handleBlur}
                  onFocus={clearRequestError}
                  aria-invalid={nameHasError}
                  aria-describedby={
                    nameHasError
                      ? "name-error"
                      : undefined
                  }
                />

                <FieldError
                  id="name-error"
                  message={
                    touched.name
                      ? errors.name
                      : undefined
                  }
                />
              </div>

              <div className={styles.field}>
                <label
                  className={styles.label}
                  htmlFor="email"
                >
                  Електронна пошта
                </label>

                <input
                  className={`${styles.input} ${
                    emailHasError
                      ? styles.inputError
                      : emailHasSuccess
                        ? styles.inputSuccess
                        : ""
                  }`}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={values.email}
                  onChange={handleTextFieldChange}
                  onBlur={handleBlur}
                  onFocus={clearRequestError}
                  autoComplete="email"
                  aria-invalid={emailHasError}
                  aria-describedby={
                    emailHasError
                      ? "email-error"
                      : "email-hint"
                  }
                />

                <FieldError
                  id="email-error"
                  message={
                    touched.email
                      ? errors.email
                      : undefined
                  }
                />

                {!emailHasError && (
                  <p
                    id="email-hint"
                    className={styles.passwordHint}
                  >
                    На нову адресу буде надіслано лист для підтвердження.
                  </p>
                )}
              </div>

              <div className={styles.passwordBlock}>
                <h2 className={styles.subtitle}>
                  Змінити пароль
                </h2>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                    htmlFor="currentPassword"
                  >
                    Поточний пароль
                  </label>

                  <input
                    className={`${styles.input} ${
                      currentPasswordHasError
                        ? styles.inputError
                        : currentPasswordHasSuccess
                          ? styles.inputSuccess
                          : ""
                    }`}
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Ваш поточний пароль"
                    value={values.currentPassword}
                    onChange={handleTextFieldChange}
                    onBlur={handleBlur}
                    onFocus={clearRequestError}
                    aria-invalid={currentPasswordHasError}
                    aria-describedby={
                      currentPasswordHasError
                        ? "current-password-error"
                        : undefined
                    }
                  />

                  <FieldError
                    id="current-password-error"
                    message={
                      touched.currentPassword
                        ? errors.currentPassword
                        : undefined
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                    htmlFor="newPassword"
                  >
                    Новий пароль
                  </label>

                  <input
                    className={`${styles.input} ${
                      newPasswordHasError
                        ? styles.inputError
                        : newPasswordHasSuccess
                          ? styles.inputSuccess
                          : ""
                    }`}
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Новий пароль"
                    value={values.newPassword}
                    onChange={handleTextFieldChange}
                    onBlur={handleBlur}
                    onFocus={clearRequestError}
                    aria-invalid={newPasswordHasError}
                    aria-describedby={
                      newPasswordHasError
                        ? "new-password-error"
                        : undefined
                    }
                  />

                  <FieldError
                    id="new-password-error"
                    message={
                      touched.newPassword
                        ? errors.newPassword
                        : undefined
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label
                    className={styles.label}
                    htmlFor="confirmNewPassword"
                  >
                    Повторіть новий пароль
                  </label>

                  <input
                    className={`${styles.input} ${
                      confirmPasswordHasError
                        ? styles.inputError
                        : confirmPasswordHasSuccess
                          ? styles.inputSuccess
                          : ""
                    }`}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    placeholder="Повторіть новий пароль"
                    value={values.confirmNewPassword}
                    onChange={handleTextFieldChange}
                    onBlur={handleBlur}
                    onFocus={clearRequestError}
                    aria-invalid={confirmPasswordHasError}
                    aria-describedby={
                      confirmPasswordHasError
                        ? "confirm-password-error"
                        : undefined
                    }
                  />

                  <FieldError
                    id="confirm-password-error"
                    message={
                      touched.confirmNewPassword
                        ? errors.confirmNewPassword
                        : undefined
                    }
                  />
                </div>

                {!hasPasswordValues && (
                  <p className={styles.passwordHint}>
                    Залиште ці поля порожніми, якщо не хочете змінювати пароль.
                  </p>
                )}
              </div>

              {status && (
                <FieldError
                  id="profile-edit-request-error"
                  message={status}
                />
              )}

              <div className={styles.actions}>
                <Button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting || !hasChanges}
                >
                  Зберегти
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className={styles.cancelButton}
                  onClick={() =>
                    router.push("/profile/saved")
                  }
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