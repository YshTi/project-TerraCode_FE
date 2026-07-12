export interface User {
  _id: string;
  name: string;
  avatarUrl: string;
  articlesAmount: number;
  savedArticles: string[];
  email?: string;
}
