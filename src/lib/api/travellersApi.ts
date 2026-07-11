import { nextServer } from "./api";

import { Traveller } from "@/types/traveller";

interface TravellersResponse {
  travellers: Traveller[];
}

export const getTravellers =
  async (): Promise<TravellersResponse> => {
    const response =
      await nextServer.get<TravellersResponse>("/travellers");

    return response.data;
  };

export const getTravellerById = async (
  travellerId: string,
): Promise<Traveller> => {
  const response = await nextServer.get<Traveller>(
    `/travellers/${travellerId}`,
  );

  return response.data;
};