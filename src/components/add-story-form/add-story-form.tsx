"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/buttons/button";
import {
  Dropdown,
  type DropdownOption,
} from "@/components/dropdown/dropdown";
import { FieldError } from "@/components/field-error/field-error";
import { Loader } from "@/components/loader/loader";
import ConfirmModal from "@/components/modals/confirm-modal/confirm-modal";
import { notify } from "@/utils/notify";
import type { Category } from "@/types/category";

import styles from "./add-story-form.module.css";

type FormValues = {
  image: File | null;
  title: string;
  category: string;
  article: string;
};

type CreateStoryResponse = {
  _id?: string;
  data?: {
    _id?: string;
  };
  story?: {
    _id?: string;
  };
  message?: string;
};

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ACCEPTED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const MAX_IMAGE_SIZE = 1024 * 1024;

const initialValues: FormValues = {
  image: null,
  title: "",
  category: "",
  article: "",
};

const isAcceptedImageFile = (file: File): boolean => {
  const fileName = file.name.toLowerCase();

  const hasAcceptedMimeType =
    ACCEPTED_IMAGE_TYPES.includes(file.type);

  const hasAcceptedExtension =
    ACCEPTED_IMAGE_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension),
    );

  return hasAcceptedMimeType && hasAcceptedExtension;
};

const addStorySchema = Yup.object({
  image: Yup.mixed<File>()
    .required("Фото обовʼязкове")
    .test(
      "file-type",
      "Файл має бути у форматі JPG, PNG або WEBP",
      (file) => {
        if (!file) {
          return false;
        }

        return isAcceptedImageFile(file);
      },
    )
    .test(
      "file-size",
      "Розмір фото не має перевищувати 1 MB",
      (file) => {
        if (!file) {
          return false;
        }

        return file.size <= MAX_IMAGE_SIZE;
      },
    ),

  title: Yup.string()
    .trim()
    .min(2, "Заголовок має містити щонайменше 2 символи")
    .max(40, "Заголовок має містити не більше 40 символів")
    .required("Введіть заголовок історії"),

  category: Yup.string().required("Оберіть категорію"),

  article: Yup.string()
    .trim()
    .min(12, "Текст історії має містити щонайменше 12 символів")
    .max(3000, "Текст історії має містити не більше 3000 символів")
    .required("Введіть текст історії"),
});

function getCreatedStoryId(data: CreateStoryResponse) {
  return data._id ?? data.data?._id ?? data.story?._id ?? null;
}

export function AddStoryForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] =
    useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    null,
  );
  const [isCancelModalOpen, setIsCancelModalOpen] =
    useState(false);

  useEffect(() => {
    let ignore = false;

    fetch("/api/categories", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) {
          setCategories(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (!ignore) {
          notify.error("Не вдалося завантажити категорії");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsCategoriesLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addStorySchema}
      validateOnMount
      onSubmit={async (
        values,
        { setSubmitting, resetForm },
      ) => {
        try {
          if (!values.image) {
            notify.error("Оберіть фото");
            return;
          }

          const formData = new FormData();

          formData.append("img", values.image);
          formData.append("title", values.title.trim());
          formData.append("category", values.category);
          formData.append(
            "article",
            values.article.trim(),
          );

          const response = await fetch("/api/stories", {
            method: "POST",
            body: formData,
          });

          const data =
            (await response.json()) as CreateStoryResponse;

          if (!response.ok) {
            notify.error(
              data.message || "Не вдалося створити історію",
            );
            return;
          }

          const createdStoryId = getCreatedStoryId(data);

          if (!createdStoryId) {
            notify.error(
              "Історію створено, але не вдалося відкрити сторінку",
            );
            return;
          }

          notify.success("Історію успішно створено!");

          resetForm();

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          router.push(`/stories/${createdStoryId}`);
        } catch {
          notify.error("Помилка з'єднання з сервером");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        dirty,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        setFieldError,
        resetForm,
      }) => {
        const categoryOptions: DropdownOption[] = [
          {
            value: "",
            label: isCategoriesLoading
              ? "Завантаження..."
              : "Категорія",
          },
          ...categories.map((category) => ({
            value: category._id,
            label: category.category,
          })),
        ];

        const isCategoryError =
          Boolean(touched.category) && !values.category;

        const isCategorySuccess =
          Boolean(touched.category) &&
          Boolean(values.category);

        const imageError =
          touched.image &&
          typeof errors.image === "string"
            ? errors.image
            : undefined;

        const handleFileChange = async (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => {
          const file =
            event.currentTarget.files?.[0] ?? null;

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }

          await setFieldTouched("image", true, false);

          if (!file) {
            await setFieldValue("image", null, true);
            return;
          }

          if (!isAcceptedImageFile(file)) {
            await setFieldValue("image", null, false);

            setFieldError(
              "image",
              "Файл має бути у форматі JPG, PNG або WEBP",
            );

            event.currentTarget.value = "";
            return;
          }

          if (file.size > MAX_IMAGE_SIZE) {
            await setFieldValue("image", null, false);

            setFieldError(
              "image",
              "Розмір фото не має перевищувати 1 MB",
            );

            event.currentTarget.value = "";
            return;
          }

          await setFieldValue("image", file, true);
          setPreviewUrl(URL.createObjectURL(file));
        };

        const handleCancel = () => {
          resetForm();

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }

          setPreviewUrl(null);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };

        const handleConfirmCancel = () => {
          handleCancel();
          setIsCancelModalOpen(false);
          router.push("/");
        };

        return (
          <>
            <form
              className={styles.form}
              onSubmit={handleSubmit}
            >
              {isSubmitting && <Loader />}

              <div className={styles.coverField}>
                <label
                  className={styles.label}
                  htmlFor="image"
                >
                  Обкладинка статті
                </label>

                <div className={styles.coverPreview}>
                  <img
                    src={
                      previewUrl ??
                      "/images/story-cover-placeholder.svg"
                    }
                    alt=""
                    className={styles.coverImage}
                  />
                </div>

                <input
                  ref={fileInputRef}
                  id="image"
                  name="image"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className={styles.hiddenFileInput}
                  onChange={handleFileChange}
                  onBlur={handleBlur}
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
                  Завантажити фото
                </Button>

                <FieldError
                  id="image-error"
                  message={imageError}
                />
              </div>

              <div className={styles.field}>
                <label
                  className={styles.label}
                  htmlFor="title"
                >
                  Заголовок
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  maxLength={40}
                  placeholder="Введіть заголовок історії"
                  value={values.title}
                  className={`${styles.input} ${
                    touched.title && errors.title
                      ? styles.inputError
                      : values.title.trim()
                        ? styles.inputSuccess
                        : ""
                  }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(
                    touched.title && errors.title,
                  )}
                  aria-describedby={
                    touched.title && errors.title
                      ? "title-error"
                      : undefined
                  }
                />

                <FieldError
                  id="title-error"
                  message={
                    touched.title
                      ? errors.title
                      : undefined
                  }
                />
              </div>

              <div className={styles.field}>
                <span className={styles.label}>
                  Категорія
                </span>

                <Dropdown
                  options={categoryOptions}
                  value={values.category}
                  ariaLabel="Оберіть категорію"
                  disabled={
                    isCategoriesLoading ||
                    isSubmitting
                  }
                  className={`${styles.categoryDropdown} ${
                    isCategorySuccess
                      ? styles.categoryDropdownSuccess
                      : ""
                  }`}
                  isError={isCategoryError}
                  isSuccess={isCategorySuccess}
                  ariaDescribedBy={
                    isCategoryError
                      ? "category-error"
                      : undefined
                  }
                  onTouched={() => {
                    setFieldTouched(
                      "category",
                      true,
                      false,
                    );
                  }}
                  onChange={(categoryId) => {
                    setFieldValue(
                      "category",
                      categoryId,
                      true,
                    );
                  }}
                />

                <FieldError
                  id="category-error"
                  message={
                    isCategoryError
                      ? "Оберіть категорію"
                      : undefined
                  }
                />
              </div>

              <div className={styles.field}>
                <label
                  className={styles.label}
                  htmlFor="article"
                >
                  Текст історії
                </label>

                <textarea
                  id="article"
                  name="article"
                  maxLength={3000}
                  placeholder="Ваша історія тут"
                  value={values.article}
                  className={`${styles.input} ${styles.textarea} ${
                    touched.article && errors.article
                      ? styles.inputError
                      : values.article.trim()
                        ? styles.inputSuccess
                        : ""
                  }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(
                    touched.article &&
                      errors.article,
                  )}
                  aria-describedby={
                    touched.article &&
                    errors.article
                      ? "article-error"
                      : undefined
                  }
                />

                <FieldError
                  id="article-error"
                  message={
                    touched.article
                      ? errors.article
                      : undefined
                  }
                />
              </div>

              <div className={styles.actions}>
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.submitButton}
                  disabled={
                    isSubmitting ||
                    !dirty ||
                    !isValid
                  }
                >
                  Зберегти
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className={styles.cancelButton}
                  onClick={() =>
                    setIsCancelModalOpen(true)
                  }
                  disabled={isSubmitting}
                >
                  Відмінити
                </Button>
              </div>
            </form>

            <ConfirmModal
              isOpen={isCancelModalOpen}
              title="Відмінити створення історії?"
              description="Усі внесені зміни буде втрачено."
              confirmButtonText="Так, відмінити"
              cancelButtonText="Повернутись"
              onConfirm={handleConfirmCancel}
              onCancel={() =>
                setIsCancelModalOpen(false)
              }
            />
          </>
        );
      }}
    </Formik>
  );
}