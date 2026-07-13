import { nextServer } from "./api";

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
