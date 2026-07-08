import Link from 'next/link';
import css from './footer.module.css';
import { SpriteIcon } from '@/components/sprite-icon/sprite-icon';

export const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.linksContainer}>

          <Link
            href="/"
            className={css.logoLink}
            aria-label="Природні Мандри — на головну"
          >
            <SpriteIcon
              id="icon-eco"
              width={24}
              height={24}
              className={css.logoIcon}
            />

            <span className={css.logoText}>
              Природні <br /> Мандри
            </span>
          </Link>

          <div className={css.socialContainer}>
            <a href="https://www.facebook.com/" className={css.link}>
              <SpriteIcon id="icon-Facebook" className={css.socialLink} />
            </a>

            <a href="https://www.instagram.com/" className={css.link}>
              <SpriteIcon id="icon-Instagram" className={css.socialLink} />
            </a>

            <a href="https://x.com/" className={css.link}>
              <SpriteIcon id="icon-X" className={css.socialLink} />
            </a>

            <a href="https://www.youtube.com/" className={css.link}>
              <SpriteIcon id="icon-Youtube" className={css.socialLink} />
            </a>
          </div>

          <nav className={css.navigation}>
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