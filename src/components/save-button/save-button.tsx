"use client";

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Button } from "@/components/buttons/button";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import {
  removeSavedStory,
  saveStory,
} from "@/lib/api/clientApi";
import { useAuth } from "@/providers/auth-provider";
import type { Story } from "@/types/story";
import { notify } from "@/utils/notify";

import css from "./save-button.module.css";

interface SaveButtonProps {
  storyId: string;
  isSaved: boolean;
  onRequireAuth: () => void;
  onSavedChange?: (isSaved: boolean) => void;
}

interface StoriesPage {
  stories: Story[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

export default function SaveButton({
  storyId,
  isSaved,
  onRequireAuth,
  onSavedChange,
}: SaveButtonProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return isSaved
        ? removeSavedStory(storyId)
        : saveStory(storyId);
    },

    onSuccess: async () => {
      const nextIsSaved = !isSaved;

      // Notify StoryCard about the successful change.
      // This updates the button and counter immediately.
      onSavedChange?.(nextIsSaved);

      if (!nextIsSaved) {
        queryClient.setQueriesData<InfiniteData<StoriesPage>>(
          {
            queryKey: ["profile-stories", "saved"],
          },
          oldData => {
            if (!oldData) {
              return oldData;
            }

            return {
              ...oldData,
              pages: oldData.pages.map(page => ({
                ...page,
                stories: page.stories.filter(
                  story => story._id !== storyId,
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
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["saved-stories"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["profile-stories", "saved"],
        }),
      ]);

      notify.success(
        nextIsSaved
          ? "Статтю збережено"
          : "Статтю видалено зі збережених",
      );
    },

    onError: (error: Error) => {
      notify.error(
        error.message || "Не вдалося виконати операцію",
      );
    },
  });

  const handleClick = () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    mutation.mutate();
  };

  return (
    <Button
      type="button"
      variant="secondary"
      className={`${css.button} ${
        isSaved ? css.saved : ""
      }`}
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-label={
        isSaved
          ? "Видалити зі збережених"
          : "Зберегти статтю"
      }
      aria-pressed={isSaved}
      aria-busy={mutation.isPending}
    >
      {mutation.isPending ? (
        <span
          className={css.spinner}
          aria-hidden="true"
        />
      ) : (
        <SpriteIcon
          id="icon-bookmark"
          width={20}
          height={20}
        />
      )}
    </Button>
  );
}