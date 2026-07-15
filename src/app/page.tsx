import dynamic from "next/dynamic";

import { Hero } from "@/components/hero/hero";

const PopularStories = dynamic(
  () =>
    import(
      "@/components/popular-stories/popular-stories"
    ).then(module => module.PopularStories),
  {
    loading: () => (
      <div
        aria-hidden="true"
        style={{ minHeight: "700px" }}
      />
    ),
  },
);

const About = dynamic(
  () =>
    import("@/components/about/about").then(
      module => module.About,
    ),
);

const OurTravellers = dynamic(
  () =>
    import(
      "@/components/our-travellers/our-travellers"
    ).then(module => module.OurTravellers),
);

const Join = dynamic(
  () =>
    import("@/components/join/join").then(
      module => module.Join,
    ),
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