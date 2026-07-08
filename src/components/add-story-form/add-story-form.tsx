import styles from "./add-story-form.module.css";

// NOTE: This is a minimal placeholder. The real implementation
// (Formik + Yup validation, image upload, category select, submit
// logic) belongs to issue #52 "AddStoryForm" and should replace this
// file's contents without changing the component's name/export, so
// this page (issue #51) keeps working unchanged.
export function AddStoryForm() {
  return (
    <form className={styles.form}>
      <p className={styles.placeholder}>
        Форма створення історії (issue #52) ще не реалізована.
      </p>
    </form>
  );
}
