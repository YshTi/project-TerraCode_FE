import { TravellersStories } from "@/components/travellers-stories/travellers-stories";

const STORIES_LIMIT = 6;

export default function MyStoriesPage() {
  return (
    <TravellersStories
      source={{
        type: "own",
      }}
      emptyState={{
        text: "Ви ще нічого не публікували, поділіться своєю першою історією!",
        buttonText: "Опублікувати історію",
        linkTo: "/stories/new",
      }}
      limit={STORIES_LIMIT}
    />
  );
}