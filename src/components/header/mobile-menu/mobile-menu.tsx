"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";

import { AuthHeader } from "@/components/auth-header/auth-header";
import { ButtonLink } from "@/components/buttons/button";
import { Container } from "@/components/container/container";
import { UserBar } from "@/components/header/user-bar/user-bar";
import { MainAuthNav } from "@/components/main-auth-nav/main-auth-nav";
import { NavLink } from "@/components/nav-link/nav-link";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";

import styles from "./mobile-menu.module.css";

type User = {
  name: string;
  avatarUrl?: string | null;
};

type MobileMenuProps = {
  user?: User | null;
  isLoggedIn: boolean;
  navLinks: {
    href: string;
    label: string;
  }[];
  onClose: () => void;
  onNavigate: () => void;
  onLogout: () => Promise<void>;
};

export function MobileMenu({
  user,
  isLoggedIn,
  navLinks,
  onClose,
  onNavigate,
  onLogout,
}: MobileMenuProps) {
  const pathname = usePathname();

  const shouldShowUserMenu = Boolean(
    isLoggedIn && user,
  );

  const isCurrentDestination = (
    href: string,
  ) => {
    if (href === "/profile") {
      return pathname.startsWith("/profile");
    }

    return pathname === href;
  };

  const handleInternalNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (isCurrentDestination(href)) {
      event.preventDefault();
      onNavigate();
      return;
    }

    onClose();
  };

  const handleLogout = async () => {
    await onLogout();
    onClose();
  };

  return (
    <div className={styles.mobileMenu}>
      <Container
        className={styles.mobileMenuContainer}
      >
        <div className={styles.mobileMenuTop}>
          <AuthHeader onNavigate={onClose} />

          <div className={styles.tabletTopActions}>
            {shouldShowUserMenu ? (
              <ButtonLink
                href="/stories/new"
                className={styles.tabletPublishButton}
                onClick={event =>
                  handleInternalNavigation(
                    event,
                    "/stories/new",
                  )
                }
              >
                Опублікувати статтю
              </ButtonLink>
            ) : (
              <MainAuthNav onNavigate={onClose} />
            )}
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрити меню"
          >
            <SpriteIcon
              id="icon-close"
              className={styles.closeIcon}
            />
          </button>
        </div>

        <nav
          className={styles.mobileNav}
          aria-label="Мобільна навігація"
        >
          {navLinks.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              className={styles.mobileNavLink}
              onClick={event =>
                handleInternalNavigation(
                  event,
                  href,
                )
              }
            >
              {label}
            </NavLink>
          ))}

          {shouldShowUserMenu && (
            <NavLink
              href="/profile"
              className={styles.mobileNavLink}
              onClick={event =>
                handleInternalNavigation(
                  event,
                  "/profile",
                )
              }
            >
              Мій Профіль
            </NavLink>
          )}
        </nav>

        <div className={styles.mobileActions}>
          {shouldShowUserMenu && user ? (
            <>
              <ButtonLink
                href="/stories/new"
                className={styles.mobilePublishButton}
                onClick={event =>
                  handleInternalNavigation(
                    event,
                    "/stories/new",
                  )
                }
              >
                Опублікувати статтю
              </ButtonLink>

              <div
                className={styles.userBarWrapper}
              >
                <UserBar
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  profileHref="/profile"
                  onLogout={handleLogout}
                  onNavigate={
                    pathname.startsWith("/profile")
                      ? onNavigate
                      : onClose
                  }
                />
              </div>
            </>
          ) : (
            <div
              className={styles.mobileOnlyAuth}
            >
              <MainAuthNav onNavigate={onClose} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}