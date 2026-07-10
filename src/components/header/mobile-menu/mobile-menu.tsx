import { Container } from "@/components/container/container";
import { AuthHeader } from "@/components/auth-header/auth-header";
import { MainAuthNav } from "@/components/main-auth-nav/main-auth-nav";
import { ButtonLink } from "@/components/buttons/button";
import { NavLink } from "@/components/nav-link/nav-link";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";
import { UserBar } from "@/components/header/user-bar/user-bar";

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
  onLogout: () => Promise<void> | void;
};

export function MobileMenu({
  user,
  isLoggedIn,
  navLinks,
  onClose,
  onLogout,
}: MobileMenuProps) {
  const shouldShowUserMenu = isLoggedIn && user;

  const handleLogout = async () => {
    await onLogout();
    onClose();
  };

  return (
    <div className={styles.mobileMenu}>
      <Container className={styles.mobileMenuContainer}>
        <div className={styles.mobileMenuTop}>
          <AuthHeader />

          <div className={styles.tabletTopActions}>
            {shouldShowUserMenu ? (
              <ButtonLink
                href="/stories/new"
                className={styles.tabletPublishButton}
                onClick={onClose}
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
            <SpriteIcon id="icon-close" className={styles.closeIcon} />
          </button>
        </div>

        <nav className={styles.mobileNav} aria-label="Мобільна навігація">
          {navLinks.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              className={styles.mobileNavLink}
              onClick={onClose}
            >
              {label}
            </NavLink>
          ))}

          {shouldShowUserMenu && (
            <NavLink
              href="/profile"
              className={styles.mobileNavLink}
              onClick={onClose}
            >
              Мій Профіль
            </NavLink>
          )}
        </nav>

        <div className={styles.mobileActions}>
          {shouldShowUserMenu ? (
            <>
              <ButtonLink
                href="/stories/new"
                className={styles.mobilePublishButton}
                onClick={onClose}
              >
                Опублікувати статтю
              </ButtonLink>

              <div className={styles.userBarWrapper}>
                <UserBar
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  profileHref="/profile"
                  onLogout={handleLogout}
                />
              </div>
            </>
          ) : (
            <div className={styles.mobileOnlyAuth}>
              <MainAuthNav onNavigate={onClose} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}