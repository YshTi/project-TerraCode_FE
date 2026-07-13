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

interface UserResponse {
  status: number;
  data: User;
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
  const response = await nextServer.get<UserResponse>(
    `/users/${userId}`,
  );

  return response.data.data;
};

export const getTravellerStories = async ({
  userId,
  page = 1,
  limit = 9,
}: TravellerStoriesParams): Promise<TravellerStoriesResponse> => {
  const response = await nextServer.get<TravellerStoriesResponse>(
    `/users/${userId}/stories`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};