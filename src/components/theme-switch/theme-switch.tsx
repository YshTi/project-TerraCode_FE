"use client";

import { Button } from "@/components/buttons/button";
import { useTheme } from "@/providers/theme-provider";

import styles from "./theme-switch.module.css";

export function ThemeSwitch() {
  const {
    theme,
    isMounted,
    toggleTheme,
  } = useTheme();

  if (!isMounted) {
    return (
      <Button
        type="button"
        className={styles.themeSwitch}
        aria-label="Змінити тему"
        disabled
      >
        🌙
      </Button>
    );
  }

  return (
    <Button
      type="button"
      className={styles.themeSwitch}
      onClick={toggleTheme}
      aria-label={
        theme === "light"
          ? "Увімкнути темну тему"
          : "Увімкнути світлу тему"
      }
    >
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
  );
}