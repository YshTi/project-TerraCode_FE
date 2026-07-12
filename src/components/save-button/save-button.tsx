"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "../buttons/button";
import { useAuth } from "@/providers/auth-provider";
import { notify } from "@/utils/notify";
import { saveStory, removeSavedStory } from "../../lib/api/clientApi";
import { SpriteIcon } from "../sprite-icon/sprite-icon";

import css from "./save-button.module.css";

interface SaveButtonProps {
  storyId: string;
  isSaved: boolean;
  onRequireAuth?: () => void;
}

export default function SaveButton({
  storyId,
  isSaved,
  onRequireAuth,
}: SaveButtonProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      isSaved ? removeSavedStory(storyId) : saveStory(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-stories"] });
      notify.success(
        isSaved ? "Статтю видалено зі збережених" : "Статтю збережено",
      );
    },
    onError: (error: Error) => {
      notify.error(error.message ?? "Не вдалося зберегти статтю");
    },
  });

  const handleClick = () => {
    if (!user) {
      onRequireAuth?.();
      return;
    }
    mutation.mutate();
  };

  return (
    <Button
      type="button"
      variant="secondary"
      className={`${css.button} ${isSaved ? css.saved : ""}`}
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-label={isSaved ? "Видалити зі збережених" : "Зберегти статтю"}
    >
      {mutation.isPending ? (
        <span className={css.spinner} />
      ) : (
        <SpriteIcon id="icon-bookmark" width={20} height={20} />
      )}
    </Button>
  );
}