import "server-only";

import { backendFetch } from "./backend";

import type {
  StoryCategory,
  StoryDetailsApiResponse,
  StoryDetailsData,
  StoryOwner,
} from "@/types/story";

interface UserProfileResponse {
  data: {
    user: {
      _id: string;
      name: string;
      avatarUrl?: string | null;
    };
  };
}

async function getRawStoryById(
  storyId: string,
): Promise<StoryDetailsApiResponse | null> {
  const response = await backendFetch(
    `/api/stories/${storyId}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch story: ${response.status}`,
    );
  }

  return (await response.json()) as StoryDetailsApiResponse;
}

async function getStoryOwner(
  ownerId: string,
): Promise<StoryOwner | null> {
  const response = await backendFetch(
    `/api/users/${ownerId}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch story owner: ${response.status}`,
    );
  }

  const result =
    (await response.json()) as UserProfileResponse;

  return {
    _id: result.data.user._id,
    name: result.data.user.name,
    avatarUrl: result.data.user.avatarUrl ?? "",
  };
}

async function getStoryCategory(
  categoryId: string,
): Promise<StoryCategory | null> {
  const response = await backendFetch("/api/categories");

  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories: ${response.status}`,
    );
  }

  const categories =
    (await response.json()) as StoryCategory[];

  return (
    categories.find(
      (category) => category._id === categoryId,
    ) ?? null
  );
}

export async function getResolvedStoryDetails(
  storyId: string,
): Promise<StoryDetailsData | null> {
  const story = await getRawStoryById(storyId);

  if (!story) {
    return null;
  }

  const [owner, category] = await Promise.all([
    getStoryOwner(story.ownerId),
    getStoryCategory(story.category),
  ]);

  return {
    _id: story._id,
    img: story.img,
    title: story.title,
    article: story.article,
    category,
    rate: story.rate,
    owner,
    date: story.date,
  };
}