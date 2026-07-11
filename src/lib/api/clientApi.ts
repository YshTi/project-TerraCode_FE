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

export const getStories = async (params: {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
}): Promise<StoriesResponse> => {
  const response = await nextServer.get<StoriesResponse>("/stories", {
    params,
  });
  return response.data;
};

export const getSavedStories = async (): Promise<{ stories: Story[] }> => {
  const response = await nextServer.get("/users/me/saved");
  return response.data;
};

export const saveStory = async (storyId: string) => {
  const response = await nextServer.patch(`/users/me/saved/${storyId}`);
  return response.data;
};

export const removeSavedStory = async (storyId: string) => {
  const response = await nextServer.delete(`/users/me/saved/${storyId}`);
  return response.data;
};