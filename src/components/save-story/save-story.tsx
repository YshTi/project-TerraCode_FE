"use client";

import { useEffect, useState } from "react";
import {
  type InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { StoriesResponse } from "@/lib/api/profileApi";
import { Button } from "@/components/buttons/button";
import { Loader } from "@/components/loader/loader";
import { ErrorWhileSavingModal } from "@/components/modals/error-while-saving-modal/error-while-saving-modal";
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

  const refreshSavedStories = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["saved-stories"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["profile-stories", "saved"],
      }),
    ]);
  };

  const saveMutation = useMutation({
    mutationFn: () => saveStory(storyId),

    onSuccess: async () => {
      await refreshSavedStories();

      notify.success("Історію збережено");
    },

    onError: () => {
      notify.error("Не вдалося зберегти історію");
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => removeSavedStory(storyId),

    onSuccess: async () => {
      queryClient.setQueriesData<InfiniteData<StoriesResponse>>(
        {
          queryKey: ["profile-stories", "saved"],
        },
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              stories: page.stories.filter(
                (story) => story._id !== storyId,
              ),
              pagination: {
                ...page.pagination,
                total: Math.max(
                  0,
                  page.pagination.total - 1,
                ),
              },
            })),
          };
        },
      );

      queryClient.setQueryData(
        ["saved-stories"],
        (
          oldData:
            | {
                stories: Array<{ _id: string }>;
              }
            | undefined,
        ) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            stories: oldData.stories.filter(
              (story) => story._id !== storyId,
            ),
          };
        },
      );

      await queryClient.invalidateQueries({
        queryKey: ["profile-stories", "saved"],
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

  const title = isSaved
    ? "Історію збережено"
    : "Збережіть собі історію";

  const description = isSaved
    ? "Історію успішно додано до збережених. Вона доступна у вашому профілі у розділі «Збережені історії»."
    : "Вона буде доступна у вашому профілі у розділі «Збережені історії».";

  const buttonText = isSaved
    ? "Видалити зі збережених"
    : "Зберегти";

  return (
    <>
      <section className={styles.wrapper}>
        <h2 className={styles.title}>
          {title}
        </h2>

        <p className={styles.description}>
          {description}
        </p>

        <Button
          className={styles.button}
          onClick={handleClick}
          disabled={isBusy}
          aria-pressed={isSaved}
          aria-busy={isBusy}
        >
          {isBusy ? <Loader /> : buttonText}
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