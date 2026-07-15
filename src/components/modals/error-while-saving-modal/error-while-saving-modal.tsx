"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

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

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="saving-error-title"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрити модальне вікно"
        >
          <SpriteIcon
            id="icon-close"
            className={styles.closeIcon}
          />
        </button>

        <div className={styles.content}>
          <h2
            id="saving-error-title"
            className={styles.title}
          >
            Помилка під час збереження
          </h2>

          <p className={styles.text}>
            Щоб зберегти статтю, вам треба увійти. Якщо ще немає
            облікового запису, зареєструйтесь.
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
    </div>,
    document.body,
  );
}