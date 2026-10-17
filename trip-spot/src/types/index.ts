export type Category =
  | "mountain"
  | "beach"
  | "city"
  | "lake"
  | "nature"
  | "historic";

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}
export interface Session {
  user: User;
  accessToken: string;
}

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

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto extends LoginDto {
  username: string;
}

export interface AuthApi {
  login(dto: LoginDto): Promise<Session>;
  register(dto: RegisterDto): Promise<Session>;
  logout(): Promise<void>;
}
