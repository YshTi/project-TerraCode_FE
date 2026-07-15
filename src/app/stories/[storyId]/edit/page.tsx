import { notFound } from "next/navigation";

import { Container } from "@/components/container/container";
import { DeleteStoryButton } from "@/components/delete-story-button/delete-story-button";
import { EditStoryForm } from "@/components/edit-story-form/edit-story-form";
import { getResolvedStoryDetails } from "@/lib/api/storyDetailsApi";

import css from "./page.module.css";

interface EditStoryPageProps {
  params: Promise<{
    storyId: string;
  }>;
}

export default async function EditStoryPage({
  params,
}: EditStoryPageProps) {
  const { storyId } = await params;

  const result =
    await getResolvedStoryDetails(storyId);

  if (!result) {
    notFound();
  }

  const story =
    "story" in result
      ? result.story
      : result;

  if (!story) {
    notFound();
  }

  return (
    <main className={css.main}>
      <Container>
        <div className={css.heading}>
          <h1 className={css.title}>
            Редагувати історію
          </h1>
          <div className={css.delete}>
            <DeleteStoryButton
            storyId={story._id}
            /> 
          </div>
        </div>

        <EditStoryForm
          key={story._id}
          story={story}
        />
      </Container>
    </main>
  );
}