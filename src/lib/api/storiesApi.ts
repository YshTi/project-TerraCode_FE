import { nextServer } from "./api";

import { Story } from "@/types/story";

interface SavedStoriesResponse {
  stories: Story[];
}

export const getSavedStories = async (): Promise<SavedStoriesResponse> => {
  const response = await nextServer.get<SavedStoriesResponse>(
    "/users/me/saved",
  );

  return response.data;
};

export const saveStory = async (
  storyId: string,
): Promise<void> => {
  await nextServer.post(`/users/me/saved/${storyId}`);
};

export const removeSavedStory = async (
  storyId: string,
): Promise<void> => {
  await nextServer.delete(`/users/me/saved/${storyId}`);
};