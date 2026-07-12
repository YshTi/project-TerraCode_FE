export interface StoryCategory {
  _id: string;
  category: string;
}

export interface StoryOwner {
  _id: string;
  name: string;
  avatarUrl: string;
}

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
