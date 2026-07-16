"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthHeader } from "@/components/auth-header/auth-header";
import { Copyright } from "@/components/copyright/copyright";
import { SpriteIcon } from "@/components/sprite-icon/sprite-icon";

import css from "./footer.module.css";

export const Footer = () => {
  const pathname = usePathname();

  const handleNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (pathname !== href) {
      return;
    }

    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.linksContainer}>
          <div className={css.logoLink}>
            <AuthHeader />
          </div>

          <div className={css.socialContainer}>
            <a
              href="https://www.facebook.com/"
              className={css.link}
              aria-label="Ми на Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SpriteIcon
                id="icon-Facebook"
                className={css.socialLink}
              />
            </a>

            <a
              href="https://www.instagram.com/"
              className={css.link}
              aria-label="Ми на Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SpriteIcon
                id="icon-Instagram"
                className={css.socialLink}
              />
            </a>

            <a
              href="https://x.com/"
              className={css.link}
              aria-label="Ми на X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SpriteIcon
                id="icon-X"
                className={css.socialLink}
              />
            </a>

            <a
              href="https://www.youtube.com/"
              className={css.link}
              aria-label="Ми на YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SpriteIcon
                id="icon-Youtube"
                className={css.socialLink}
              />
            </a>
          </div>

          <nav
            className={css.navigation}
            aria-label="Навігація сайтом"
          >
            <Link
              href="/"
              className={css.navLink}
              onClick={(event) =>
                handleNavigation(event, "/")
              }
            >
              Головна
            </Link>

            <Link
              href="/stories"
              className={css.navLink}
              onClick={(event) =>
                handleNavigation(event, "/stories")
              }
            >
              Статті
            </Link>

            <Link
              href="/travellers"
              className={css.navLink}
              onClick={(event) =>
                handleNavigation(event, "/travellers")
              }
            >
              Еко-Мандрівники
            </Link>
          </nav>
        </div>

        <hr className={css.hr} />

        <Copyright className={css.copyRight} />
      </div>
    </footer>
  );
};