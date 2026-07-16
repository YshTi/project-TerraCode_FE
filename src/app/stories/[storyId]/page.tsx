import { notFound } from "next/navigation";

import { Container } from "@/components/container/container";
import { PopularStories } from "@/components/popular-stories/popular-stories";
import { SaveStory } from "@/components/save-story/save-story";
import { StoryDetails } from "@/components/story-details/story-details";
import { getResolvedStoryDetails } from "@/lib/api/storyDetailsApi";

import css from "./page.module.css";

interface StoryPageProps {
  params: Promise<{
    storyId: string;
  }>;
}

export default async function StoryPage({
  params,
}: StoryPageProps) {
  const { storyId } = await params;

  const story = await getResolvedStoryDetails(storyId);

  if (!story) {
    notFound();
  }

  return (
    <main className={css.main}>
      <Container className={css.storyContainer}>
        <StoryDetails story={story} />
        <SaveStory storyId={storyId} />
      </Container>
      <PopularStories excludeStoryId={storyId} title="Вам також сподобається"/>
    </main>
  );
}
