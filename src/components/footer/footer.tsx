import Link from 'next/link';
import Logo from '@/components/logo/logo';
import { SpriteIcon } from '@/components/sprite-icon/sprite-icon';
import css from './footer.module.css';

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
            <Logo />
          </Link>

          <div className={css.socialContainer}>
            <a href="https://www.facebook.com/" className={css.link} aria-label="Ми на Facebook" rel="noopener noreferrer" target="_blank">
              <SpriteIcon id="icon-Facebook" width={24} height={24} className={css.socialLink} />
            </a>

            <a href="https://www.instagram.com/" className={css.link} aria-label="Ми на Instagram" rel="noopener noreferrer" target="_blank">
              <SpriteIcon id="icon-Instagram" width={24} height={24} className={css.socialLink} />
            </a>

            <a href="https://x.com/" className={css.link} aria-label="Ми на X" rel="noopener noreferrer" target="_blank">
              <SpriteIcon id="icon-X" width={24} height={24} className={css.socialLink} />
            </a>

            <a href="https://www.youtube.com/" className={css.link} aria-label="Ми на YouTube" rel="noopener noreferrer" target="_blank">
              <SpriteIcon id="icon-Youtube" width={24} height={24} className={css.socialLink} />
            </a>
          </div>

          <nav className={css.navigation} aria-label="Навігація сайтом">
            <Link href="/" className={css.navLink}>Головна</Link>
            <Link href="/stories" className={css.navLink}>Статті</Link>
            <Link href="/travellers" className={css.navLink}>Еко-Мандрівники</Link>
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