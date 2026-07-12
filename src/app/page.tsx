import { Hero } from "@/components/hero/hero";
import { PopularStories } from "@/components/popular-stories/popular-stories";
import { About } from "@/components/about/about";
import { OurTravellers } from "@/components/our-travellers/our-travellers";
import { Join } from "@/components/join/join";


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
