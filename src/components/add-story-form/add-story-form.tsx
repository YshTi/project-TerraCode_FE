"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/buttons/button";
import { FieldError } from "@/components/field-error/field-error";
import { notify } from "@/utils/notify";
import type { Category } from "@/types/category";
import type { Story } from "@/types/story";

import styles from "./add-story-form.module.css";

type FormValues = {
  image: File | null;
  title: string;
  category: string;
  article: string;
};

const initialValues: FormValues = {
  image: null,
  title: "",
  category: "",
  article: "",
};

const addStorySchema = Yup.object({
  image: Yup.mixed<File>().required("Додайте зображення для обкладинки"),

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

          const data = await response.json();

          if (!response.ok) {
            notify.error(data.message || "Не вдалося створити історію");
            return;
          }

          const createdStory = data as Story;

          notify.success("Історію успішно створено!");
          resetForm();

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }

          router.push(`/stories/${createdStory._id}`);
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
        resetForm,
      }) => {
        const handleFileChange = (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => {
          const file = event.target.files?.[0] ?? null;

          setFieldValue("image", file);

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }

          setPreviewUrl(file ? URL.createObjectURL(file) : null);
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
            <div className={styles.field}>
              <label className={styles.label}>Обкладинка статті</label>

              <div className={styles.imagePreview}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Прев'ю обкладинки історії"
                    className={styles.previewImg}
                  />
                ) : (
                  <svg
                    className={styles.placeholderIcon}
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect width="64" height="64" rx="8" fill="none" />
                    <circle cx="22" cy="22" r="6" fill="currentColor" />
                    <path
                      d="M6 50L24 32L36 44L46 34L58 46V54C58 55.1046 57.1046 56 56 56H8C6.89543 56 6 55.1046 6 54V50Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.hiddenFileInput}
                onChange={handleFileChange}
                onBlur={handleBlur}
                name="image"
                id="image"
              />

              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                Завантажити фото
              </Button>

              {touched.image && (
                <FieldError id="image-error" message={errors.image} />
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="title">
                Заголовок
              </label>

              <input
                className={`${styles.input} ${
                  touched.title && errors.title ? styles.inputError : ""
                }`}
                id="title"
                name="title"
                type="text"
                placeholder="Введіть заголовок історії"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.title && errors.title)}
                aria-describedby={
                  touched.title && errors.title ? "title-error" : undefined
                }
              />

              {touched.title && (
                <FieldError id="title-error" message={errors.title} />
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="category">
                Категорія
              </label>

              <select
                className={`${styles.input} ${styles.select} ${
                  touched.category && errors.category
                    ? styles.inputError
                    : ""
                }`}
                id="category"
                name="category"
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isCategoriesLoading}
                aria-invalid={Boolean(touched.category && errors.category)}
              >
                <option value="" disabled>
                  {isCategoriesLoading ? "Завантаження..." : "Категорія"}
                </option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category}
                  </option>
                ))}
              </select>

              {touched.category && (
                <FieldError id="category-error" message={errors.category} />
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="article">
                Текст історії
              </label>

              <textarea
                className={`${styles.input} ${styles.textarea} ${
                  touched.article && errors.article ? styles.inputError : ""
                }`}
                id="article"
                name="article"
                placeholder="Ваша історія тут"
                value={values.article}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.article && errors.article)}
                aria-describedby={
                  touched.article && errors.article
                    ? "article-error"
                    : undefined
                }
              />

              {touched.article && (
                <FieldError id="article-error" message={errors.article} />
              )}
            </div>

            <div className={styles.actions}>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !dirty || !isValid}
              >
                Зберегти
              </Button>

              <Button
                type="button"
                variant="secondary"
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
