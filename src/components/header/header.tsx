"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Container } from "@/components/container/container";
import { AuthHeader } from "@/components/auth-header/auth-header";
import { MainAuthNav } from "@/components/main-auth-nav/main-auth-nav";
import { ButtonLink } from "@/components/buttons/button";
import { NavLink } from "@/components/nav-link/nav-link";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import { UserBar } from "@/components/header/user-bar/user-bar";
import { MobileMenu } from "@/components/header/mobile-menu/mobile-menu";
import { useAuth } from "@/providers/auth-provider";

import styles from "./header.module.css";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/stories", label: "Статті" },
  { href: "/travellers", label: "Еко-Мандрівники" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  const { user, isLoading, logout } = useAuth();

  const isLoggedIn = Boolean(user);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();

    router.replace("/");
    router.refresh();
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1440px)");

    const handleResize = () => {
      if (mediaQuery.matches) {
        setIsMenuOpen(false);
      }
    };

    handleResize();

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <AuthHeader />

        <nav className={styles.nav}>
          {navLinks.map(({ href, label }) => (
            <NavLink key={href} href={href} className={styles.navLink}>
              {label}
            </NavLink>
          ))}

          {isLoggedIn && (
            <NavLink href="/profile" className={styles.navLink}>
              Мій Профіль
            </NavLink>
          )}
        </nav>

        <div className={styles.desktopActions}>
          {isLoading ? null : user ? (
            <>
              <ButtonLink
                href="/stories/new"
                className={styles.publishButton}
              >
                Опублікувати статтю
              </ButtonLink>

              <UserBar
                name={user.name}
                avatarUrl={user.avatarUrl}
                profileHref="/profile"
                onLogout={handleLogout}
              />
            </>
          ) : (
            <MainAuthNav />
          )}
        </div>

        <div className={styles.tabletActions}>
          {isLoading ? null : user ? (
            <ButtonLink
              href="/stories/new"
              className={styles.publishButton}
            >
              Опублікувати статтю
            </ButtonLink>
          ) : (
            <MainAuthNav />
          )}
        </div>

        <button
          type="button"
          className={styles.burgerButton}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={isMenuOpen}
        >
          <SpriteIcon
            id={isMenuOpen ? "icon-close" : "icon-menu"}
            className={styles.burgerIcon}
          />
        </button>
      </Container>

      {isMenuOpen && (
        <MobileMenu
          user={user}
          isLoggedIn={isLoggedIn}
          navLinks={navLinks}
          onClose={closeMenu}
          onLogout={handleLogout}
        />
      )}
    </header>
  );
}