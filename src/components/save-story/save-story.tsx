"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/buttons/button";
import { Loader } from "@/components/loader/loader";
import { useAuth } from "@/providers/auth-provider";
import {
  getSavedStories,
  saveStory,
  removeSavedStory,
} from "@/lib/api/storiesApi";

import styles from "./save-story.module.css";

type SaveStoryProps = {
  storyId: string;
  onOpenModal: () => void;
};

export function SaveStory({
  storyId,
  onOpenModal,
}: SaveStoryProps) {
  const { user } = useAuth();

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    async function loadSavedStories() {
      try {
        const { stories } = await getSavedStories();

        setSaved(
          stories.some(({ _id }) => _id === storyId),
        );
      } catch {
        toast.error("Не вдалося отримати збережені історії");
      }
    }

    loadSavedStories();
  }, [storyId, user]);

  const handleClick = async () => {
    if (!user) {
      onOpenModal();
      return;
    }

    setIsLoading(true);

    try {
      if (saved) {
        await removeSavedStory(storyId);
        setSaved(false);
        toast.success("Історію видалено зі збережених");
      } else {
        await saveStory(storyId);
        setSaved(true);
        toast.success("Історію збережено");
      }
    } catch {
      toast.error("Не вдалося виконати операцію");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>
        Збережіть собі історію
      </h2>

      <p className={styles.description}>
        Вона буде доступна у вашому профілі у розділі
        {" "}
        «Збережене».
      </p>

      <Button
        className={styles.button}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader />
        ) : saved ? (
          "Видалити зі збережених"
        ) : (
          "Зберегти"
        )}
      </Button>
    </section>
  );
}