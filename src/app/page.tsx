import dynamic from "next/dynamic";

import { Hero } from "@/components/hero/hero";

import styles from "./page.module.css";

function SectionFallback({
  className,
}: {
  className: string;
}) {
  return (
    <div
      className={`${styles.dynamicSectionFallback} ${className}`}
      aria-hidden="true"
    />
  );
}

const PopularStories = dynamic(
  () =>
    import(
      "@/components/popular-stories/popular-stories"
    ).then(module => module.PopularStories),
  {
    loading: () => (
      <SectionFallback
        className={styles.popularStoriesFallback}
      />
    ),
  },
);

const About = dynamic(
  () =>
    import("@/components/about/about").then(
      module => module.About,
    ),
  {
    loading: () => (
      <SectionFallback className={styles.aboutFallback} />
    ),
  },
);

const OurTravellers = dynamic(
  () =>
    import(
      "@/components/our-travellers/our-travellers"
    ).then(module => module.OurTravellers),
  {
    loading: () => (
      <SectionFallback
        className={styles.travellersFallback}
      />
    ),
  },
);

const Join = dynamic(
  () =>
    import("@/components/join/join").then(
      module => module.Join,
    ),
  {
    loading: () => (
      <SectionFallback className={styles.joinFallback} />
    ),
  },
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularStories />
      <About />
      <OurTravellers />
      <Join />
    </>
  );
}