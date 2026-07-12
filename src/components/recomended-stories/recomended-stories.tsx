"use client";

import { useEffect, useState } from "react";

import StoryCard from "@/components/story-card/story-card";
import styles from "./recomended-stories.module.css";
import { Story } from "@/types/story";

interface RecommendedStoriesProps {
  stories: Story[];
}

export function RecommendedStories({ stories }: RecommendedStoriesProps) {
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1440) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Вам також сподобається</h2>

      <ul className={styles.list}>
        {stories.slice(0, visibleCount).map((story) => (
          <StoryCard key={story._id} story={story} isSaved={false} />
        ))}
      </ul>
    </section>
  );
}
