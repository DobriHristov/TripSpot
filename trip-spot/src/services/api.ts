import {
  supabaseAuthApi,
  supabasePlacesApi,
  supabaseImagesApi,
  supabaseReviewsApi,
  supabaseFavoritesApi,
} from "./supabase/supabaseApi";

export const authApi = supabaseAuthApi;
export const placesApi = supabasePlacesApi;
export const imagesApi = supabaseImagesApi;
export const reviewsApi = supabaseReviewsApi;
export const favoritesApi = supabaseFavoritesApi;
