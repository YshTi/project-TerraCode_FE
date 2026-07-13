"use client";

import { useEffect, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Button } from "@/components/buttons/button";
import { ErrorWhileSavingModal } from "@/components/modals/error-while-saving-modal/error-while-saving-modal";
import { Loader } from "@/components/loader/loader";
import {
  getSavedStories,
  removeSavedStory,
  saveStory,
} from "@/lib/api/clientApi";
import { useAuth } from "@/providers/auth-provider";
import { notify } from "@/utils/notify";

import styles from "./save-story.module.css";

interface SaveStoryProps {
  storyId: string;
}

export function SaveStory({ storyId }: SaveStoryProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const savedStoriesQuery = useQuery({
    queryKey: ["saved-stories"],
    queryFn: getSavedStories,
    enabled: Boolean(user),
  });

  const isSaved =
    savedStoriesQuery.data?.stories.some(
      (story) => story._id === storyId,
    ) ?? false;

  useEffect(() => {
    if (savedStoriesQuery.isError) {
      notify.error(
        "Не вдалося перевірити, чи збережена історія",
      );
    }
  }, [savedStoriesQuery.isError]);

  const saveMutation = useMutation({
    mutationFn: () => saveStory(storyId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["saved-stories"],
      });

      notify.success("Історію збережено");
    },

    onError: () => {
      notify.error("Не вдалося зберегти історію");
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => removeSavedStory(storyId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["saved-stories"],
      });

      notify.success("Історію видалено зі збережених");
    },

    onError: () => {
      notify.error(
        "Не вдалося видалити історію зі збережених",
      );
    },
  });

  const handleClick = () => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }

    if (isSaved) {
      removeMutation.mutate();
      return;
    }

    saveMutation.mutate();
  };

  const isUpdating =
    saveMutation.isPending || removeMutation.isPending;

  const isChecking =
    Boolean(user) && savedStoriesQuery.isLoading;

  const isBusy = isChecking || isUpdating;

  return (
    <>
      <section className={styles.wrapper}>
        <h2 className={styles.title}>
          {isSaved
            ? "Історію збережено"
            : "Збережіть собі історію"}
        </h2>

        <p className={styles.description}>
          {isSaved
            ? "Історію успішно додано до збережених. Вона доступна у вашому профілі у розділі «Збережені історії»."
            : "Вона буде доступна у вашому профілі у розділі збережене"}
        </p>

        <Button
          className={styles.button}
          onClick={handleClick}
          disabled={isBusy}
          aria-pressed={isSaved}
          aria-busy={isBusy}
        >
          {isBusy ? (
            <Loader />
          ) : isSaved ? (
            "Видалити зі збережених"
          ) : (
            "Зберегти"
          )}
        </Button>
      </section>

      <ErrorWhileSavingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
