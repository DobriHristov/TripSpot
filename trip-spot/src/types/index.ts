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

export interface PlaceQuery {
  search?: string | undefined;
  category?: Category | "" | undefined;
  authorId?: string | undefined;
}

export interface PageQuery extends PlaceQuery {
  page: number;
  limit: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PlaceDto {
  title: string;
  location: string;
  category: Category;
  description: string;
  imageUrl: string;
  images?: string[];
  lat: number;
  lng: number;
}

export interface ReviewDto {
  text: string;
  rating: number;
}

export interface Review {
  id: string;
  placeId: string;
  authorId: string;
  authorName: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface ReviewsApi {
  listByPlace(placeId: string): Promise<Review[]>;
  create(placeId: string, dto: ReviewDto): Promise<Review>;
  remove(id: string): Promise<void>;
}

export interface PlacesApi {
  getById(id: string): Promise<Place>;
  create(dto: PlaceDto): Promise<Place>;
  update(id: string, dto: PlaceDto): Promise<Place>;
  remove(id: string): Promise<void>;
  toggleLike(id: string): Promise<Place>;
}

export interface ImagesApi {
  upload(file: File): Promise<string>;
}

export interface FavoritesApi {
  list(): Promise<Place[]>;
  ids(): Promise<string[]>;
  add(placeId: string): Promise<void>;
  remove(placeId: string): Promise<void>;
}
