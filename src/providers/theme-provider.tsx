"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  isMounted: boolean;
  toggleTheme: () => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

const subscribe = () => {
  return () => {};
};

function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.localStorage.getItem("theme") ===
    "dark"
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] =
    useState<Theme>(getInitialTheme);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    document.documentElement.dataset.theme =
      theme;

    window.localStorage.setItem(
      "theme",
      theme,
    );
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme(currentTheme =>
      currentTheme === "light"
        ? "dark"
        : "light",
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isMounted,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider",
    );
  }

  return context;
}