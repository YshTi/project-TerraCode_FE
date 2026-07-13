export interface StoryCategory {
  _id: string;
  category: string;
}

export interface StoryOwner {
  _id: string;
  name: string;
  avatarUrl: string;
}

/**
 * Story returned by the stories-list endpoint.
 * ownerId and category are populated objects.
 */
export interface Story {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: StoryCategory;
  rate: number;
  ownerId: StoryOwner | null;
  date: string;
}

/**
 * Story returned by GET /api/stories/:storyId.
 * ownerId and category are raw MongoDB IDs.
 */
export interface StoryDetailsApiResponse {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: string;
  rate: number;
  ownerId: string;
  date: string;
}

/**
 * Data prepared for rendering by StoryDetails.
 */
export interface StoryDetailsData {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: StoryCategory | null;
  rate: number;
  owner: StoryOwner | null;
  date: string;
}