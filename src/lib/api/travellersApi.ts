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
    user: User;
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
  const response = await nextServer.get<UsersResponse>(
    "/users",
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
};

export const getTravellerById = async (
  userId: string,
): Promise<User> => {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    throw new Error("User ID is required");
  }

  const response =
    await nextServer.get<TravellerProfileResponse>(
      `/users/${normalizedUserId}`,
      {
        params: {
          page: 1,
          perPage: 1,
        },
      },
    );

  const user = response.data.data?.user;

  if (!user) {
    throw new Error("Traveller was not found");
  }

  return user;
};

export const getTravellerStories = async ({
  userId,
  page = 1,
  limit = 9,
}: TravellerStoriesParams): Promise<TravellerStoriesResponse> => {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    throw new Error("User ID is required");
  }

  const response =
    await nextServer.get<TravellerProfileResponse>(
      `/users/${normalizedUserId}`,
      {
        params: {
          page,
          perPage: limit,
        },
      },
    );

  const { user, stories, pagination } =
    response.data.data;

  const currentPage = Number(pagination.page);
  const perPage = Number(pagination.perPage);
  const totalStories = Number(
    pagination.totalStories,
  );
  const totalPages = Number(
    pagination.totalPages,
  );

  if (
    !Number.isFinite(currentPage) ||
    !Number.isFinite(perPage) ||
    !Number.isFinite(totalStories) ||
    !Number.isFinite(totalPages)
  ) {
    throw new Error(
      "Invalid traveller pagination response",
    );
  }

  return {
    stories: stories.map(story => ({
      ...story,
      ownerId: {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl ?? "",
      },
    })),

    pagination: {
      page: currentPage,
      limit: perPage,
      total: totalStories,
      totalPages,
      hasNextPage:
        currentPage < totalPages,
      hasPreviousPage:
        currentPage > 1,
    },
  };
};