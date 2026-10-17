import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../integrations/supabase/client";
import { authApi } from "../services/api";
import type { LoginDto, RegisterDto, User } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login(dto: LoginDto): Promise<void>;
  register(dto: RegisterDto): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async (
      userId: string,
      email: string,
      createdAt: string,
    ) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", userId)
        .maybeSingle();
      if (cancelled) return;
      setUser({
        id: userId,
        email,
        username: profile?.display_name ?? email.split("@")[0] ?? "Потребител",
        createdAt,
      });
    };

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session?.user) {
        void loadUser(
          data.session.user.id,
          data.session.user.email ?? "",
          data.session.user.created_at,
        );
      }
      setIsReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        void loadUser(
          session.user.id,
          session.user.email ?? "",
          session.user.created_at,
        );
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    const session = await authApi.login(dto);
    setUser(session.user);
  }, []);

  const register = useCallback(async (dto: RegisterDto) => {
    const session = await authApi.register(dto);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isReady, login, register, logout }),
    [user, isReady, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
