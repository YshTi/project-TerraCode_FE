"use client";

import type { MouseEvent } from "react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { AuthHeader } from "@/components/auth-header/auth-header";
import { ButtonLink } from "@/components/buttons/button";
import { Container } from "@/components/container/container";
import { MobileMenu } from "@/components/header/mobile-menu/mobile-menu";
import { UserBar } from "@/components/header/user-bar/user-bar";
import { MainAuthNav } from "@/components/main-auth-nav/main-auth-nav";
import { NavLink } from "@/components/nav-link/nav-link";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import { ThemeSwitch } from "@/components/theme-switch/theme-switch";
import { useAuth } from "@/providers/auth-provider";

import styles from "./header.module.css";

const navLinks = [
  {
    href: "/",
    label: "Головна",
  },
  {
    href: "/stories",
    label: "Статті",
  },
  {
    href: "/travellers",
    label: "Еко-Мандрівники",
  },
];

function isSameDestination(
  pathname: string,
  href: string,
) {
  if (href === "/profile") {
    return pathname.startsWith("/profile");
  }

  return pathname === href;
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const shouldScrollToTopRef =
    useRef(false);

  const { user, isLoading, logout } =
    useAuth();

  const isLoggedIn = Boolean(user);

  const scrollToPageTop = (
    behavior: ScrollBehavior = "smooth",
  ) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeMenuAndScrollTop = () => {
    shouldScrollToTopRef.current = true;
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(previous => !previous);
  };

  const handleCurrentPageNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!isSameDestination(pathname, href)) {
      return;
    }

    event.preventDefault();
    scrollToPageTop();
  };

  const handleLogout = async () => {
    await logout();

    router.replace("/");
    router.refresh();
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 1440px)",
    );

    const handleResize = () => {
      if (mediaQuery.matches) {
        setIsMenuOpen(false);
      }
    };

    handleResize();

    mediaQuery.addEventListener(
      "change",
      handleResize,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleResize,
      );
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (
      isMenuOpen ||
      !shouldScrollToTopRef.current
    ) {
      return;
    }

    shouldScrollToTopRef.current = false;

    const timeoutId = window.setTimeout(() => {
      scrollToPageTop("auto");
    }, 50);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <Container
        className={styles.headerContainer}
      >
        <AuthHeader />

        <nav className={styles.nav}>
          {navLinks.map(
            ({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                className={styles.navLink}
                onClick={event =>
                  handleCurrentPageNavigation(
                    event,
                    href,
                  )
                }
              >
                {label}
              </NavLink>
            ),
          )}

          {isLoggedIn && (
            <NavLink
              href="/profile"
              className={styles.navLink}
              onClick={event =>
                handleCurrentPageNavigation(
                  event,
                  "/profile",
                )
              }
            >
              Мій Профіль
            </NavLink>
          )}
        </nav>

        <ThemeSwitch />

        <div
          className={styles.desktopActions}
        >
          {isLoading ? null : user ? (
            <>
              <ButtonLink
                href="/stories/new"
                className={
                  styles.publishButton
                }
                onClick={event =>
                  handleCurrentPageNavigation(
                    event,
                    "/stories/new",
                  )
                }
              >
                Опублікувати статтю
              </ButtonLink>

              <UserBar
                name={user.name}
                avatarUrl={user.avatarUrl}
                profileHref="/profile"
                onLogout={handleLogout}
                onNavigate={() => {
                  if (
                    pathname.startsWith(
                      "/profile",
                    )
                  ) {
                    scrollToPageTop();
                  }
                }}
              />
            </>
          ) : (
            <MainAuthNav />
          )}
        </div>

        <div
          className={styles.tabletActions}
        >
          {isLoading ? null : user ? (
            <ButtonLink
              href="/stories/new"
              className={
                styles.publishButton
              }
              onClick={event =>
                handleCurrentPageNavigation(
                  event,
                  "/stories/new",
                )
              }
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
          aria-label={
            isMenuOpen
              ? "Закрити меню"
              : "Відкрити меню"
          }
          aria-expanded={isMenuOpen}
        >
          <SpriteIcon
            id={
              isMenuOpen
                ? "icon-close"
                : "icon-menu"
            }
            className={
              styles.burgerIcon
            }
          />
        </button>
      </Container>

      {isMenuOpen && (
        <MobileMenu
          user={user}
          isLoggedIn={isLoggedIn}
          navLinks={navLinks}
          onClose={closeMenu}
          onNavigate={
            closeMenuAndScrollTop
          }
          onLogout={handleLogout}
        />
      )}
    </header>
  );
}