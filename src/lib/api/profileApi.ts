import { nextServer } from "./api";

import type { Story } from "@/types/story";

interface StoriesParams {
  page?: number;
  limit?: number;
}

interface ProfileStoriesResponse {
  stories: Story[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getSavedStories = async (
  params: StoriesParams,
): Promise<ProfileStoriesResponse> => {
  const response =
    await nextServer.get<ProfileStoriesResponse>(
      "/users/me/saved",
      {
        params,
      },
    );

  return response.data;
};

export const getOwnStories = async (
  params: StoriesParams,
): Promise<ProfileStoriesResponse> => {
  const response =
    await nextServer.get<ProfileStoriesResponse>(
      "/users/me/stories",
      {
        params,
      },
    );

  return response.data;
};