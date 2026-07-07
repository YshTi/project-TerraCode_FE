"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/buttons/button";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";

import styles from "./confirmation-modal.module.css";

type ConfirmationModalProps = {
  title: string;
  text: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationModal({
  title,
  text,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onCancel]);

  return createPortal(
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-text"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onCancel}
          aria-label="Закрити"
        >
          <SpriteIcon id="icon-close" width={24} height={24} />
        </button>

        <h2 id="confirmation-title" className={styles.title}>
          {title}
        </h2>

        <p id="confirmation-text" className={styles.text}>
          {text}
        </p>

        <div className={styles.actions}>
          <Button variant="secondary" className={styles.cancelButton} onClick={onCancel}>
            {cancelText}
          </Button>

          <Button variant="primary" className={styles.confirmButton} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}