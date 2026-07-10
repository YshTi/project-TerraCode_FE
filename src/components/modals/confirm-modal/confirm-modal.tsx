'use client';

import { useEffect } from 'react';

import  PageTitle  from '@/components/page-title/page-title';
import { Button } from '@/components/buttons/button';
import { SpriteIcon } from '@/components/sprite-icon/sprite-icon';

import styles from './confirm-modal.module.css';

type Props = {
  isOpen: boolean;
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
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

  return (
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
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

              <PageTitle
          className={styles.title}
          tag="h2"
          id="confirm-modal-title"
        >
          {title}
        </PageTitle>

        <p className={styles.subtitle}>
          Ми будемо сумувати за вами!
        </p>

        <div className={styles.actions}>
          <Button
            onClick={onCancel}
            className={styles.button}
            variant="secondary"
          >
            {cancelButtonText}
          </Button>

          <Button
            onClick={onConfirm}
            className={styles.button}
            variant="primary"
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}