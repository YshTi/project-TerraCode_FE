"use client";

import { Button } from "@/components/buttons/button";
import { useTheme } from "@/providers/theme-provider";

import styles from "./theme-switch.module.css";

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

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