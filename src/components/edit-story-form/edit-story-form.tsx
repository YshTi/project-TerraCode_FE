"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import type { Category } from "@/types/category";
import type { Story } from "@/types/story";
import { notify } from "@/utils/notify";

import styles from "./edit-story-form.module.css";

type FormValues = {
  title: string;
  category: string;
  article: string;
};

type UpdateStoryResponse = {
  status?: number;
  message?: string;
  data?: Story;
};

type EditStoryFormProps = {
  story: Story;
};

const editStorySchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(
      2,
      "Заголовок має містити щонайменше 2 символи",
    )
    .max(
      40,
      "Заголовок має містити не більше 40 символів",
    )
    .required("Введіть заголовок історії"),

  category: Yup.string().required(
    "Оберіть категорію",
  ),

  article: Yup.string()
    .trim()
    .min(
      12,
      "Текст історії має містити щонайменше 12 символів",
    )
    .max(
      3000,
      "Текст історії має містити не більше 3000 символів",
    )
    .required("Введіть текст історії"),
});

function getCategoryId(
  category: Story["category"],
): string {
  if (typeof category === "string") {
    return category;
  }

  return category?._id ?? "";
}

export function EditStoryForm({
  story,
}: EditStoryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [
    isCategoriesLoading,
    setIsCategoriesLoading,
  ] = useState(true);

  const [
    isCancelModalOpen,
    setIsCancelModalOpen,
  ] = useState(false);

  const initialValues = useMemo<FormValues>(
    () => ({
      title: story.title,
      category: getCategoryId(
        story.category,
      ),
      article: story.article,
    }),
    [story],
  );

  useEffect(() => {
    let ignore = false;

    fetch("/api/categories", {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to load categories",
          );
        }

        return response.json();
      })
      .then((data) => {
        if (!ignore) {
          setCategories(
            Array.isArray(data) ? data : [],
          );
        }
      })
      .catch(() => {
        if (!ignore) {
          notify.error(
            "Не вдалося завантажити категорії",
          );
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

  const clearRelevantCaches = async () => {
    queryClient.removeQueries({
      queryKey: [
        "profile-stories",
        "own",
      ],
    });

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["stories"],
      }),

      queryClient.invalidateQueries({
        queryKey: [
          "story",
          story._id,
        ],
      }),

      queryClient.invalidateQueries({
        queryKey: [
          "profile-stories",
          "own",
        ],
      }),

      queryClient.invalidateQueries({
        queryKey: [
          "traveller-stories",
        ],
      }),
    ]);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={editStorySchema}
      validateOnMount
      enableReinitialize
      onSubmit={async (
        values,
        {
          setSubmitting,
          resetForm,
        },
      ) => {
        try {
          const response = await fetch(
            `/api/stories/${story._id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                title:
                  values.title.trim(),
                category:
                  values.category,
                article:
                  values.article.trim(),
              }),
            },
          );

          const contentType =
            response.headers.get(
              "content-type",
            );

          const data: UpdateStoryResponse =
            contentType?.includes(
              "application/json",
            )
              ? await response.json()
              : {
                  message:
                    await response.text(),
                };

          if (!response.ok) {
            notify.error(
              data.message ||
                "Не вдалося оновити історію",
            );

            return;
          }

          await clearRelevantCaches();

          notify.success(
            "Історію успішно оновлено!",
          );

          resetForm({
            values: {
              title:
                data.data?.title ??
                values.title.trim(),

              category:
                data.data?.category
                  ? getCategoryId(
                      data.data.category,
                    )
                  : values.category,

              article:
                data.data?.article ??
                values.article.trim(),
            },
          });

          router.push(
            `/stories/${story._id}`,
          );

          router.refresh();
        } catch (error) {
          console.error(
            "Story update failed:",
            error,
          );

          notify.error(
            "Помилка з'єднання з сервером",
          );
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
      }) => {
        const categoryOptions:
          DropdownOption[] = [
          {
            value: "",
            label: isCategoriesLoading
              ? "Завантаження..."
              : "Категорія",
          },

          ...categories.map(
            (category) => ({
              value: category._id,
              label:
                category.category,
            }),
          ),
        ];

        const isCategoryError =
          Boolean(touched.category) &&
          Boolean(errors.category);

        const isCategorySuccess =
          Boolean(touched.category) &&
          Boolean(values.category) &&
          !errors.category;

        const handleConfirmCancel =
          () => {
            setIsCancelModalOpen(false);

            router.push(
              `/stories/${story._id}`,
            );
          };

        return (
          <>
            <form
              className={styles.form}
              onSubmit={handleSubmit}
            >
              {isSubmitting && <Loader />}

              <div
                className={
                  styles.coverField
                }
              >
                <span
                  className={styles.label}
                >
                  Обкладинка статті
                </span>

                <div
                  className={
                    styles.coverPreview
                  }
                >
                  <img
                    src={story.img}
                    alt={`Обкладинка історії «${story.title}»`}
                    className={
                      styles.coverImage
                    }
                  />
                </div>
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
                  placeholder="Введіть заголовок історії"
                  value={values.title}
                  className={`${styles.input} ${
                    touched.title &&
                    errors.title
                      ? styles.inputError
                      : touched.title &&
                          values.title.trim() &&
                          !errors.title
                        ? styles.inputSuccess
                        : ""
                  }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(
                    touched.title &&
                      errors.title,
                  )}
                  aria-describedby={
                    touched.title &&
                    errors.title
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
                <span
                  className={styles.label}
                >
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
                  className={`${
                    styles.categoryDropdown
                  } ${
                    isCategorySuccess
                      ? styles.categoryDropdownSuccess
                      : ""
                  }`}
                  isError={
                    isCategoryError
                  }
                  isSuccess={
                    isCategorySuccess
                  }
                  ariaDescribedBy={
                    isCategoryError
                      ? "category-error"
                      : undefined
                  }
                  onTouched={() => {
                    void setFieldTouched(
                      "category",
                      true,
                      false,
                    );
                  }}
                  onChange={(
                    categoryId,
                  ) => {
                    void setFieldValue(
                      "category",
                      categoryId,
                      true,
                    );
                  }}
                />

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
                <label
                  className={styles.label}
                  htmlFor="article"
                >
                  Текст історії
                </label>

                <textarea
                  id="article"
                  name="article"
                  placeholder="Ваша історія тут"
                  value={values.article}
                  className={`${styles.input} ${
                    styles.textarea
                  } ${
                    touched.article &&
                    errors.article
                      ? styles.inputError
                      : touched.article &&
                          values.article.trim() &&
                          !errors.article
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

              <div
                className={styles.actions}
              >
                <Button
                  type="submit"
                  variant="primary"
                  className={
                    styles.submitButton
                  }
                  disabled={
                    isSubmitting ||
                    !dirty ||
                    !isValid
                  }
                >
                  Зберегти зміни
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className={
                    styles.cancelButton
                  }
                  onClick={() => {
                    setIsCancelModalOpen(
                      true,
                    );
                  }}
                  disabled={isSubmitting}
                >
                  Відмінити
                </Button>
              </div>
            </form>

            <ConfirmModal
              isOpen={isCancelModalOpen}
              title="Відмінити редагування історії?"
              description="Усі внесені зміни буде втрачено."
              confirmButtonText="Так, відмінити"
              cancelButtonText="Повернутись"
              onConfirm={
                handleConfirmCancel
              }
              onCancel={() => {
                setIsCancelModalOpen(false);
              }}
            />
          </>
        );
      }}
    </Formik>
  );
}