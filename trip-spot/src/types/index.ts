export type Category =
  | "mountain"
  | "beach"
  | "city"
  | "lake"
  | "nature"
  | "historic";

export interface Place {
  id: string;
  title: string;
  location: string;
  category: Category;
  description: string;
  imageUrl: string;
  images?: string[];
  lat: number;
  lng: number;
  authorId: string;
  authorName: string;
  likes: string[];
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}
