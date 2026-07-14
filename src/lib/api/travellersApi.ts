import { nextServer } from "./api";

import type { Story } from "@/types/story";
import type { User } from "@/types/user";

interface UsersResponse {
  status: number;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TravellerProfileResponse {
  data: {
    user: {
      _id: string;
      name: string;
      avatarUrl?: string | null;
    };
    stories: Story[];
    pagination: {
      page: number;
      perPage: number;
      totalStories: number;
      totalPages: number;
    };
  };
}

export interface TravellerStoriesResponse {
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

interface TravellerStoriesParams {
  userId: string;
  page?: number;
  limit?: number;
}

export const getTravellers = async (
  page = 1,
  limit = 12,
): Promise<UsersResponse> => {
  const response = await nextServer.get<UsersResponse>("/users", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const getTravellerById = async (
  userId: string,
): Promise<User> => {
  const response = await nextServer.get<TravellerProfileResponse>(
    `/users/${userId}`,
    {
      params: {
        page: 1,
        perPage: 1,
      },
    },
  );

  return response.data.data.user;
};

export const getTravellerStories = async ({
  userId,
  page = 1,
  limit = 9,
}: TravellerStoriesParams): Promise<TravellerStoriesResponse> => {
  const response =
    await nextServer.get<TravellerProfileResponse>(
      `/users/${userId}`,
      {
        params: {
          page,
          perPage: limit,
        },
      },
    );

  const { user, stories, pagination } = response.data.data;

  return {
    stories: stories.map((story) => ({
      ...story,
      ownerId: {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl ?? "",
      },
    })),
    pagination: {
      page: pagination.page,
      limit: pagination.perPage,
      total: pagination.totalStories,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPreviousPage: pagination.page > 1,
    },
  };
};
