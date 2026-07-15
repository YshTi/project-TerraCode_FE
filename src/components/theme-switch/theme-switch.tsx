"use client";

import { useEffect, useState } from "react";

import styles from "./theme-switch.module.css";

export function ThemeSwitch() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Читаем сохраненную тему при загрузке
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

  // Сохраняем тему при изменении
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button className={styles.themeSwitch}
      onClick={() =>
        setTheme(theme === "light" ? "dark" : "light")
      }
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}