"use client";

import { useEffect } from "react";

import { ButtonLink } from "@/components/buttons/button";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";

import styles from "./error-while-saving-modal.module.css";

type ErrorWhileSavingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ErrorWhileSavingModal({
  isOpen,
  onClose,
}: ErrorWhileSavingModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрити модальне вікно"
        >
          <SpriteIcon id="icon-close" className={styles.closeIcon} />
        </button>

        <div className={styles.content}>
          <h2 className={styles.title}>Помилка під час збереження</h2>

          <p className={styles.text}>
            Щоб зберегти статтю вам треба увійти, якщо ще немає облікового
            запису зареєструйтесь.
          </p>
        </div>

        <div className={styles.actions}>
          <ButtonLink
            href="/auth/login"
            variant="secondary"
            className={styles.actionButton}
            onClick={onClose}
          >
            Увійти
          </ButtonLink>

          <ButtonLink
            href="/auth/register"
            variant="primary"
            className={styles.actionButton}
            onClick={onClose}
          >
            Зареєструватись
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
