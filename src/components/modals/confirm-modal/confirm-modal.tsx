'use client';

import { useEffect } from 'react';
import { createPortal } from "react-dom";

import { PageTitle } from '@/components/page-title/page-title';
import { Button } from '@/components/buttons/button';
import { SpriteIcon } from '@/components/sprite-icon/sprite-icon';

import styles from './confirm-modal.module.css';

type Props = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby={
          description
            ? "confirm-modal-description"
            : undefined
        }
      >
        <button
          type="button"
          className={styles.close}
          onClick={onCancel}
          aria-label="Закрити модальне вікно"
        >
          <SpriteIcon
            id="icon-close"
            className={styles.closeIcon}
            width={24}
            height={24}
          />
        </button>

        <div id="confirm-modal-title">
          <PageTitle className={styles.title}>
            {title}
          </PageTitle>
        </div>

        {description && (
          <p
            id="confirm-modal-description"
            className={styles.subtitle}
          >
            {description}
          </p>
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            onClick={onCancel}
            className={styles.button}
            variant="secondary"
          >
            {cancelButtonText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            className={styles.button}
            variant="primary"
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}