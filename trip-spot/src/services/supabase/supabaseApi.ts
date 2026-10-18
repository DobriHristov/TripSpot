import { supabase } from "../../integrations/supabase/client";
import type { Tables } from "../../integrations/supabase/types";
import type {
  AuthApi,
  FavoritesApi,
  ImagesApi,
  PageQuery,
  Paginated,
  Place,
  PlaceQuery,
  PlacesApi,
  ReviewsApi,
  User,
} from "../../types";
import { ApiError } from "../../utils/errors";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

type PlaceRow = Tables<"places">;

const fail = (
  error: { message: string; code?: string | undefined } | null,
  fallback: string,
): never => {
  throw new ApiError(
    error?.message ?? fallback,
    error?.code === "23505" ? 409 : 400,
  );
};

const toUser = (
  id: string,
  email: string,
  username: string,
  createdAt: string,
): User => ({
  id,
  email,
  username,
  createdAt,
});

const hydratePlaces = async (rows: PlaceRow[]): Promise<Place[]> => {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const authorIds = [...new Set(rows.map((r) => r.author_id))];

  const [profilesRes, likesRes, reviewsRes] = await Promise.all([
    supabase.from("profiles").select("id, display_name").in("id", authorIds),
    supabase
      .from("place_likes")
      .select("place_id, user_id")
      .in("place_id", ids),
    supabase.from("reviews").select("place_id, rating").in("place_id", ids),
  ]);

  const nameById = new Map(
    (profilesRes.data ?? []).map((p) => [p.id, p.display_name]),
  );
  const likesByPlace = new Map<string, string[]>();

  for (const l of likesRes.data ?? []) {
    likesByPlace.set(l.place_id, [
      ...(likesByPlace.get(l.place_id) ?? []),
      l.user_id,
    ]);
  }

  const ratingsByPlace = new Map<string, number[]>();

  for (const r of reviewsRes.data ?? []) {
    ratingsByPlace.set(r.place_id, [
      ...(ratingsByPlace.get(r.place_id) ?? []),
      r.rating,
    ]);
  }

  return rows.map((row) => {
    const ratings = ratingsByPlace.get(row.id) ?? [];

    return {
      id: row.id,
      title: row.name,
      location: row.location,
      category: row.category as Place["category"],
      description: row.description,
      imageUrl: row.image_url ?? row.image_urls?.[0] ?? "",
      images: row.image_urls?.length
        ? row.image_urls
        : row.image_url
          ? [row.image_url]
          : [],
      lat: row.lat ?? 0,
      lng: row.lng ?? 0,
      authorId: row.author_id,
      authorName: nameById.get(row.author_id) ?? "Неизвестен",
      likes: likesByPlace.get(row.id) ?? [],
      rating: ratings.length
        ? ratings.reduce((s, r) => s + r, 0) / ratings.length
        : 0,
      reviewsCount: ratings.length,
      createdAt: row.created_at,
      updatedAt: row.created_at,
    };
  });
};

const fetchUser = async (
  userId: string,
  email: string,
  createdAt: string,
): Promise<User> => {
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();

  return toUser(
    userId,
    email,
    profile?.display_name ?? email.split("@")[0] ?? "Потребител",
    createdAt,
  );
};

const applyPlaceFilters = (query: PlaceQuery) => {
  let q = supabase.from("places").select("*", { count: "exact" });

  if (query.category) {
    q = q.eq("category", query.category);
  }

  if (query.authorId) {
    q = q.eq("author_id", query.authorId);
  }

  const search = query.search?.trim();

  if (search) {
    const pattern = `%${search}%`;
    q = q.or(
      `name.ilike.${pattern},location.ilike.${pattern},description.ilike.${pattern}`,
    );
  }

  return q.order("created_at", { ascending: false });
};

const requireUserId = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new ApiError("Моля, влезте в профила си.", 401);
  }

  return data.user.id;
};

export const supabasePlacesApi: PlacesApi = {
  list: async (query = {}) => {
    const { data, error } = await applyPlaceFilters(query);

    if (error) {
      fail(error, "Грешка при зареждане на местата.");
    }

    return hydratePlaces(data ?? []);
  },

  search: async (query: PageQuery): Promise<Paginated<Place>> => {
    const limit = Math.max(1, query.limit);
    const page = Math.max(1, query.page);
    const from = (page - 1) * limit;
    const { data, error, count } = await applyPlaceFilters(query).range(
      from,
      from + limit - 1,
    );

    if (error) {
      fail(error, "Грешка при зареждане на местата.");
    }

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items: await hydratePlaces(data ?? []),
      total,
      page,
      limit,
      totalPages,
    };
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      fail(error, "Грешка при зареждане на мястото.");
    }

    if (!data) {
      throw new ApiError("Мястото не е намерено.", 404);
    }

    const [place] = await hydratePlaces([data]);

    return place!;
  },

  create: async (dto) => {
    const authorId = await requireUserId();

    const { data, error } = await supabase
      .from("places")
      .insert({
        author_id: authorId,
        name: dto.title,
        location: dto.location,
        category: dto.category,
        description: dto.description,
        image_url: dto.images?.[0] ?? dto.imageUrl,
        image_urls: dto.images?.length
          ? dto.images
          : dto.imageUrl
            ? [dto.imageUrl]
            : [],
        lat: dto.lat,
        lng: dto.lng,
      })
      .select()
      .single();

    if (error) {
      fail(error, "Грешка при създаване на мястото.");
    }

    const [place] = await hydratePlaces([data!]);

    return place!;
  },

  update: async (id, dto) => {
    await requireUserId();

    const { data, error } = await supabase
      .from("places")
      .update({
        name: dto.title,
        location: dto.location,
        category: dto.category,
        description: dto.description,
        image_url: dto.images?.[0] ?? dto.imageUrl,
        image_urls: dto.images?.length
          ? dto.images
          : dto.imageUrl
            ? [dto.imageUrl]
            : [],
        lat: dto.lat,
        lng: dto.lng,
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      fail(error, "Грешка при редактиране на мястото.");
    }

    if (!data) {
      throw new ApiError(
        "Моля, имайте предвид, че редакция е разрешена само на автора.",
        403,
      );
    }

    const [place] = await hydratePlaces([data]);

    return place!;
  },

  remove: async (id) => {
    await requireUserId();

    const { error, count } = await supabase
      .from("places")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      fail(error, "Грешка при изтриване на мястото.");
    }

    if (!count) {
      throw new ApiError(
        "Моля, имайте предвид, че изтриването е разрешено само на автора.",
        403,
      );
    }
  },

  toggleLike: async (id) => {
    const userId = await requireUserId();
    const { data: existing } = await supabase
      .from("place_likes")
      .select("place_id")
      .eq("place_id", id)
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) {
      const { error } = await supabase
        .from("place_likes")
        .delete()
        .eq("place_id", id)
        .eq("user_id", userId);
      if (error) fail(error, "Грешка при премахване на харесването.");
    } else {
      const { error } = await supabase
        .from("place_likes")
        .insert({ place_id: id, user_id: userId });
      if (error) fail(error, "Грешка при харесване.");
    }

    return supabasePlacesApi.getById(id);
  },
};

export const supabaseAuthApi: AuthApi = {
  login: async (dto) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });
    if (error || !data.session)
      throw new ApiError("Грешен имейл или парола.", 401);
    const user = await fetchUser(
      data.user.id,
      data.user.email ?? dto.email,
      data.user.created_at,
    );
    return { user, accessToken: data.session.access_token };
  },
  register: async (dto) => {
    const { data, error } = await supabase.auth.signUp({
      email: dto.email.trim(),
      password: dto.password,
      options: { data: { display_name: dto.username.trim() } },
    });
    if (error) fail(error, "Регистрацията не успя.");
    if (!data.session || !data.user) {
      throw new ApiError(
        "Регистрацията Ви е успешна. Моля, потвърдете имейл адреса си, за да можете да влезете в профила си.",
        200,
      );
    }
    const user = toUser(
      data.user.id,
      data.user.email ?? dto.email,
      dto.username.trim(),
      data.user.created_at,
    );
    return { user, accessToken: data.session.access_token };
  },
  logout: async () => {
    await supabase.auth.signOut();
  },
};

export const supabaseImagesApi: ImagesApi = {
  upload: async (file) => {
    const userId = await requireUserId();

    if (!file.type.startsWith("image/")) {
      throw new ApiError("Моля, изберете файл с изображение.", 400);
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new ApiError("Моля, изберете снимка с размер до 5 MB.", 400);
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("place-images")
      .upload(path, file, { contentType: file.type });

    if (error) {
      fail(error, "Грешка при качване на снимката.");
    }

    const { data, error: signError } = await supabase.storage
      .from("place-images")
      .createSignedUrl(path, TEN_YEARS);

    if (signError || !data) {
      fail(signError, "Грешка при качване на снимката.");
    }

    return data!.signedUrl;
  },
};

export const supabaseReviewsApi: ReviewsApi = {
  listByPlace: async (placeId) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles(display_name)")
      .eq("place_id", placeId)
      .order("created_at", { ascending: false });

    if (error) {
      fail(error, "Грешка при зареждане на ревютата.");
    }

    return (data ?? []).map((r) => ({
      id: r.id,
      placeId: r.place_id,
      authorId: r.author_id,
      authorName:
        (r.profiles as { display_name: string } | null)?.display_name ??
        "Неизвестен",
      text: r.comment,
      rating: r.rating,
      createdAt: r.created_at,
    }));
  },

  create: async (placeId, dto) => {
    const authorId = await requireUserId();

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        place_id: placeId,
        author_id: authorId,
        rating: dto.rating,
        comment: dto.text.trim(),
      })
      .select("*, profiles(display_name)")
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new ApiError("Вече сте оставили отзив за това място.", 409);
      }

      fail(error, "Грешка при добавяне на ревю.");
    }

    return {
      id: data!.id,
      placeId: data!.place_id,
      authorId: data!.author_id,
      authorName:
        (data!.profiles as { display_name: string } | null)?.display_name ??
        "Аз",
      text: data!.comment,
      rating: data!.rating,
      createdAt: data!.created_at,
    };
  },

  remove: async (id) => {
    await requireUserId();

    const { error, count } = await supabase
      .from("reviews")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      fail(error, "Грешка при изтриване на ревюто.");
    }

    if (!count) {
      throw new ApiError(
        "Изтриването на отзива е разрешено само на неговия автор.",
        403,
      );
    }
  },
};

export const supabaseFavoritesApi: FavoritesApi = {
  list: async () => {
    const userId = await requireUserId();

    const { data, error } = await supabase
      .from("favorites")
      .select("place_id, places(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      fail(error, "Грешка при зареждане на любимите.");
    }

    const rows = (data ?? [])
      .map((f) => f.places)
      .filter((p): p is PlaceRow => !!p);

    return hydratePlaces(rows);
  },

  ids: async () => {
    const userId = await requireUserId();

    const { data, error } = await supabase
      .from("favorites")
      .select("place_id")
      .eq("user_id", userId);

    if (error) {
      fail(error, "Грешка при зареждане на любимите.");
    }

    return (data ?? []).map((f) => f.place_id);
  },

  add: async (placeId) => {
    const userId = await requireUserId();

    const { error } = await supabase
      .from("favorites")
      .upsert({ user_id: userId, place_id: placeId });

    if (error) {
      fail(error, "Грешка при добавяне в любими.");
    }
  },

  remove: async (placeId) => {
    const userId = await requireUserId();

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("place_id", placeId);

    if (error) {
      fail(error, "Грешка при премахване от любими.");
    }
  },
};
