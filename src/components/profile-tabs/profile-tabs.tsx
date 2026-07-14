"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import css from "./profile-tabs.module.css";

const TABS = [
  { href: "/profile/saved", label: "Збережені історії" },
  { href: "/profile/my-stories", label: "Мої історії" },
];

export function ProfileTabs() {
  const pathname = usePathname();

  return (
    <div className={css.tabs}>
      {TABS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={pathname === href ? css.tabActive : css.tab}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}