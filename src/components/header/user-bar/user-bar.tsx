"use client";

import Image from "next/image";
import { useState } from "react";

import { ConfirmationModal } from "@/components/confirmation-modal/confirmation-modal";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import { DEFAULT_AVATAR_URL } from "@/constants/user";

import styles from "./user-bar.module.css";

type UserBarProps = {
  name?: string;
  avatarUrl?: string | null;
};

export function UserBar({ name = "Імʼя", avatarUrl }: UserBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const avatarSrc = avatarUrl || DEFAULT_AVATAR_URL;

  const handleLogout = () => {
    // TODO: connect real logout later
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={styles.userBar}>
        <Image
          src={avatarSrc}
          alt={name}
          width={40}
          height={40}
          className={styles.avatar}
        />

        <span className={styles.name}>{name}</span>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={() => setIsModalOpen(true)}
          aria-label="Вийти з акаунту"
        >
          <SpriteIcon id="icon-logout" width={24} height={24} />
        </button>
      </div>

      {isModalOpen && (
        <ConfirmationModal
            title="Ви точно хочете вийти?"
            text="Ми будемо сумувати за вами!"
            confirmText="Вийти"
            cancelText="Відмінити"
            onConfirm={handleLogout}
            onCancel={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}