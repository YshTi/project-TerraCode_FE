import Link from "next/link";

import { Container } from "@/components/container/container";
import { Copyright } from "@/components/copyright/copyright";

import styles from "./footer.module.css";

import { AuthHeader } from '@/components/auth-header/auth-header';
import { SpriteIcon } from '@/components/sprite-icon/sprite-icon';

import css from './footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        <Link className={styles.logo} href="/">
          Природні Мандри
        </Link>

        <Copyright />
      </Container>
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
              <SpriteIcon id="icon-Facebook" className={css.socialLink} />
            </a>

            <a
              href="https://www.instagram.com/"
              className={css.link}
              aria-label="Ми на Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SpriteIcon id="icon-Instagram" className={css.socialLink} />
            </a>

            <a
              href="https://x.com/"
              className={css.link}
              aria-label="Ми на X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SpriteIcon id="icon-X" className={css.socialLink} />
            </a>

            <a
              href="https://www.youtube.com/"
              className={css.link}
              aria-label="Ми на YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SpriteIcon id="icon-Youtube" className={css.socialLink} />
            </a>
          </div>

          <nav className={css.navigation} aria-label="Навігація сайтом">
            <Link href="/" className={css.navLink}>
              Головна
            </Link>

            <Link href="/stories" className={css.navLink}>
              Статті
            </Link>

            <Link href="/travellers" className={css.navLink}>
              Еко-Мандрівники
            </Link>
          </nav>
        </div>

        <hr className={css.hr} />

        <p className={css.copyRight}>
          © 2025 Природні Мандри. Усі права захищені.
        </p>
      </div>
    </footer>
  );
};