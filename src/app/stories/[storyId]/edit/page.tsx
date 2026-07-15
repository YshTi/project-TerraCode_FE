import { notFound } from "next/navigation";

import { Container } from "@/components/container/container";
import { DeleteStoryButton } from "@/components/delete-story-button/delete-story-button";
import {
  EditStoryForm,
  type EditableStory,
} from "@/components/edit-story-form/edit-story-form";
import { getResolvedStoryDetails } from "@/lib/api/storyDetailsApi";

import css from "./page.module.css";

interface EditStoryPageProps {
  params: Promise<{
    storyId: string;
  }>;
}

function isEditableStory(
  value: unknown,
): value is EditableStory {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  return (
    "_id" in value &&
    typeof value._id === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    "article" in value &&
    typeof value.article === "string" &&
    "img" in value &&
    typeof value.img === "string" &&
    "category" in value
  );
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

  const candidate =
    typeof result === "object" &&
    result !== null &&
    "story" in result
      ? result.story
      : result;

  if (!isEditableStory(candidate)) {
    notFound();
  }

  const story = candidate;

  return (
    <main className={css.main}>
      <Container>
        <div className={css.heading}>
          <h1 className={css.title}>
            Редагувати історію
          </h1>

          <div className={css.delete}>
            <DeleteStoryButton
              storyId={storyId}
            />
          </div>
        </div>

        <EditStoryForm
          key={storyId}
          story={story}
        />
      </Container>
    </main>
  );
}