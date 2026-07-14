"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/buttons/button";
import { FieldError } from "@/components/field-error/field-error";
import { Loader } from "@/components/loader/loader";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
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

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const initialValues: FormValues = {
  image: null,
  title: "",
  category: "",
  article: "",
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

        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      },
    )
    .test(
      "file-size",
      "Розмір фото не має перевищувати 10 MB",
      (file) => {
        if (!file) {
          return false;
        }

        return file.size <= MAX_IMAGE_SIZE;
      },
    ),

  title: Yup.string()
    .trim()
    .min(3, "Заголовок має містити щонайменше 3 символи")
    .required("Введіть заголовок історії"),

  category: Yup.string().required("Оберіть категорію"),

  article: Yup.string()
    .trim()
    .min(10, "Текст історії має містити щонайменше 10 символів")
    .required("Введіть текст історії"),
});

function getCreatedStoryId(data: CreateStoryResponse) {
  return data._id ?? data.data?._id ?? data.story?._id ?? null;
}

export function AddStoryForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    fetch("/api/categories", { cache: "no-store" })
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
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const formData = new FormData();

          formData.append("img", values.image as File);
          formData.append("title", values.title.trim());
          formData.append("category", values.category);
          formData.append("article", values.article.trim());

          const response = await fetch("/api/stories", {
            method: "POST",
            body: formData,
          });

          const data = (await response.json()) as CreateStoryResponse;

          if (!response.ok) {
            notify.error(data.message || "Не вдалося створити історію");
            return;
          }

          const createdStoryId = getCreatedStoryId(data);

          if (!createdStoryId) {
            notify.error("Історію створено, але не вдалося відкрити сторінку");
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
        resetForm,
      }) => {
        const imageError =
          touched.image && typeof errors.image === "string"
            ? errors.image
            : undefined;

        const handleFileChange = (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => {
          const file = event.currentTarget.files?.[0] ?? null;

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }

          setFieldTouched("image", true, false);
          setFieldValue("image", file, true);

          if (
            file &&
            ACCEPTED_IMAGE_TYPES.includes(file.type) &&
            file.size <= MAX_IMAGE_SIZE
          ) {
            setPreviewUrl(URL.createObjectURL(file));
            return;
          }

          setPreviewUrl(null);
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

        return (
          <form className={styles.form} onSubmit={handleSubmit}>
            {isSubmitting && <Loader />}

            <div className={styles.coverField}>
              <label className={styles.label} htmlFor="image">
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
                accept="image/jpeg,image/png,image/webp"
                className={styles.hiddenFileInput}
                onChange={handleFileChange}
                onBlur={handleBlur}
              />

              <Button
                type="button"
                variant="secondary"
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                Завантажити фото
              </Button>

              <FieldError id="image-error" message={imageError} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="title">
                Заголовок
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Введіть заголовок історії"
                value={values.title}
                className={`${styles.input} ${
                  touched.title && errors.title
                    ? styles.inputError
                    : ""
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.title && errors.title)}
                aria-describedby={
                  touched.title && errors.title
                    ? "title-error"
                    : undefined
                }
              />

              <FieldError
                id="title-error"
                message={
                  touched.title ? errors.title : undefined
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="category">
                Категорія
              </label>

              <div className={styles.selectWrapper}>
                <select
                  id="category"
                  name="category"
                  value={values.category}
                  className={`${styles.input} ${styles.select} ${
                    touched.category && errors.category
                      ? styles.inputError
                      : ""
                  }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isCategoriesLoading || isSubmitting}
                  aria-invalid={Boolean(
                    touched.category && errors.category,
                  )}
                  aria-describedby={
                    touched.category && errors.category
                      ? "category-error"
                      : undefined
                  }
                >
                  <option value="" disabled>
                    {isCategoriesLoading
                      ? "Завантаження..."
                      : "Категорія"}
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.category}
                    </option>
                  ))}
                </select>

                <SpriteIcon
                  id="icon-arrow_down"
                  width={24}
                  height={24}
                  className={styles.selectIcon}
                  aria-hidden="true"
                />
              </div>

              <FieldError
                id="category-error"
                message={
                  touched.category
                    ? errors.category
                    : undefined
                }
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="article">
                Текст історії
              </label>

              <textarea
                id="article"
                name="article"
                placeholder="Ваша історія тут"
                value={values.article}
                className={`${styles.input} ${styles.textarea} ${
                  touched.article && errors.article
                    ? styles.inputError
                    : ""
                }`}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(
                  touched.article && errors.article,
                )}
                aria-describedby={
                  touched.article && errors.article
                    ? "article-error"
                    : undefined
                }
              />

              <FieldError
                id="article-error"
                message={
                  touched.article ? errors.article : undefined
                }
              />
            </div>

            <div className={styles.actions}>
              <Button
                type="submit"
                variant="primary"
                className={styles.submitButton}
                disabled={isSubmitting || !dirty || !isValid}
              >
                Зберегти
              </Button>

              <Button
                type="button"
                variant="secondary"
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Відмінити
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}