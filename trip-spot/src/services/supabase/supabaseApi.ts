import { supabase } from "../../integrations/supabase/client";
import type { AuthApi, User } from "../../types";
import { ApiError } from "../../utils/errors";

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
        "Регистрацията е успешна — потвърди имейла си и влез.",
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
