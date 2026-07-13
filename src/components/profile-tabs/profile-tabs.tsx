"use client";

import css from "./profile-tabs.module.css";

export type ProfileTab = "saved" | "own";

interface ProfileTabsProps {
  value: ProfileTab;
  onChange: (value: ProfileTab) => void;
}

const TABS: Array<{
  value: ProfileTab;
  label: string;
}> = [
  {
    value: "saved",
    label: "Збережені історії",
  },
  {
    value: "own",
    label: "Мої історії",
  },
];

export function ProfileTabs({
  value,
  onChange,
}: ProfileTabsProps) {
  return (
    <div
      className={css.tabs}
      role="tablist"
      aria-label="Історії користувача"
    >
      {TABS.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? css.tabActive : css.tab}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}