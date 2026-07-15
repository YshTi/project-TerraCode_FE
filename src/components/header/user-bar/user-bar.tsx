"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ConfirmModal from "@/components/modals/confirm-modal/confirm-modal";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import { DEFAULT_AVATAR_URL } from "@/constants/user";

import styles from "./user-bar.module.css";

type UserBarProps = {
  name?: string;
  avatarUrl?: string | null;
  profileHref?: string;
  onLogout?: () => Promise<void> | void;
};

export function UserBar({
  name = "Імʼя",
  avatarUrl,
  profileHref = "/profile",
  onLogout,
}: UserBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const avatarSrc = avatarUrl || DEFAULT_AVATAR_URL;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await onLogout?.();
      setIsModalOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className={styles.userBar}>
        <Link
          href={profileHref}
          className={styles.profileLink}
          aria-label={`Перейти до профілю користувача ${name}`}
        >
          <Image
            src={avatarSrc}
            alt={name}
            width={32}
            height={32}
            className={styles.avatar}
          />

          <span className={styles.name} title={name}>
            {name}
          </span>
        </Link>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={() => setIsModalOpen(true)}
          aria-label="Вийти з акаунту"
        >
          <SpriteIcon
            id="icon-logout"
            width={24}
            height={24}
          />
        </button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Ви точно хочете вийти?"
        description="Ми будемо сумувати за вами!"
        confirmButtonText={
          isLoggingOut ? "Вихід..." : "Вийти"
        }
        cancelButtonText="Відмінити"
        onConfirm={handleLogout}
        onCancel={() => {
          if (!isLoggingOut) {
            setIsModalOpen(false);
          }
        }}
      />
    </>
  );
}