import { nextServer } from "./api";

import { Story } from "@/types/story";

interface StoriesResponse {
  stories: Story[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface SavedStoriesResponse {
  stories: Story[];
}

interface StoriesParams {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
}

export const getStories = async (
  params: StoriesParams,
): Promise<StoriesResponse> => {
  const response = await nextServer.get<StoriesResponse>(
    "/stories",
    {
      params,
    },
  );

  return response.data;
};

export const getSavedStories =
  async (): Promise<SavedStoriesResponse> => {
    const response =
      await nextServer.get<SavedStoriesResponse>(
        "/users/me/saved",
      );

    return response.data;
  };

export const saveStory = async (
  storyId: string,
): Promise<SavedStoriesResponse> => {
  const response =
    await nextServer.patch<SavedStoriesResponse>(
      `/users/me/saved/${storyId}`,
    );

  return response.data;
};

export const removeSavedStory = async (
  storyId: string,
): Promise<SavedStoriesResponse> => {
  const response =
    await nextServer.delete<SavedStoriesResponse>(
      `/users/me/saved/${storyId}`,
    );

  return response.data;
};