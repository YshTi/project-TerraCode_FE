import { Container } from "@/components/container/container";

import styles from './about.module.css';


export function About() {
  return (
    <section className={styles.about}>
      <Container>
        <div className={styles.aboutWrapper}>
          <div className={styles.aboutContent}>
            <h2 className={styles.aboutTitle}>Мандруй екологічно та відкривай нові горизонти</h2>
            <p className={styles.aboutDescription}>Наш проєкт створений для тих, хто хоче досліджувати Україну відповідально. Ми допоможемо знайти унікальні маршрути, які поєднують красу природи, локальну культуру та принципи сталого туризму.</p>
            <ul className={styles.aboutList}>
              <li className={styles.aboutItem}>
                <h4 className={styles.aboutItemTitle}>Еко-маршрути по Україні</h4>
                <p className={styles.aboutText}>Від Карпат до Чорного моря — добірка локацій, де можна подорожувати без шкоди для довкілля.</p>
              </li>
              <li className={styles.aboutItem}>
                <h4 className={styles.aboutItemTitle}>Практичні екологічні поради</h4>
                <p className={styles.aboutText}>Дізнайся, як зменшити свій екологічний слід під час мандрів, та зробити подорож комфортною й свідомою.</p>
              </li>
            </ul>
          </div>
          <div className={styles.aboutImg}>
            <img src="/images/about-img.webp" alt="about-img" />
          </div>
        </div>
      </Container>
    </section>
  );
}