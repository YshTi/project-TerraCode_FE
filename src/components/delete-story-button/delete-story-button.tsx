"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/buttons/button";
import ConfirmModal from "@/components/modals/confirm-modal/confirm-modal";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import { useAuth } from "@/providers/auth-provider";
import { notify } from "@/utils/notify";

import css from "./delete-story-button.module.css";

interface DeleteStoryButtonProps {
  storyId: string;
}

type DeleteStoryResponse = {
  message?: string;
};

export function DeleteStoryButton({
  storyId,
}: DeleteStoryButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const handleDeleteStory = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(
        `/api/stories/${storyId}`,
        {
          method: "DELETE",
        },
      );

      const contentType =
        response.headers.get("content-type");

      const data: DeleteStoryResponse =
        contentType?.includes(
          "application/json",
        )
          ? await response.json()
          : {
              message: await response.text(),
            };

      if (!response.ok) {
        notify.error(
          data.message ||
            "Не вдалося видалити історію",
        );

        return;
      }

      queryClient.removeQueries({
        queryKey: ["story", storyId],
      });

      queryClient.removeQueries({
        queryKey: [
          "profile-stories",
          "own",
        ],
      });

      await Promise.all([
        refreshUser(),

        queryClient.invalidateQueries({
          queryKey: ["stories"],
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

        queryClient.invalidateQueries({
          queryKey: ["profile"],
        }),
      ]);

      notify.success(
        "Історію успішно видалено!",
      );

      router.replace("/profile/my-stories");
      router.refresh();
    } catch (error) {
      console.error(
        "Story delete failed:",
        error,
      );

      notify.error(
        "Помилка з'єднання з сервером",
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div
        className={
          css.deleteButtonWrapper
        }
      >
        <Button
          type="button"
          variant="secondary"
          className={
            css.deleteIconButton
          }
          onClick={() => {
            setIsDeleteModalOpen(true);
          }}
          disabled={isDeleting}
          aria-label="Видалити історію"
        >
          <SpriteIcon
            id="icon-bin"
            width={20}
            height={20}
          />
        </Button>

        <span
          className={css.deleteTooltip}
          role="tooltip"
        >
          Видалити історію
        </span>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Видалити історію?"
        description="Цю дію неможливо буде скасувати."
        confirmButtonText={
          isDeleting
            ? "Видалення..."
            : "Так, видалити"
        }
        cancelButtonText="Повернутись"
        onConfirm={() => {
          void handleDeleteStory();
        }}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
          }
        }}
      />
    </>
  );
}